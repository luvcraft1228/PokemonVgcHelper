import { AuthService, type RegisterInput, type LoginInput } from "../auth.service";
import { UserRepository } from "../../repositories/user.repository";
import { User } from "../../models/user.model";
import { BadRequestError, UnauthorizedError } from "../../shared/http-error";
import { hashPassword, verifyPassword } from "../../shared/password";
import { signToken } from "../../shared/token";
import type { RefreshTokenRow } from "../../repositories/user.repository";

// Mock du repository
jest.mock("../../repositories/user.repository");

describe("AuthService", () => {
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  const mockUser = new User({
    id: 1,
    email: "test@example.com",
    password_hash: hashPassword("password123"),
    created_at: new Date(),
    updated_at: new Date(),
  });

  const mockRefreshToken: RefreshTokenRow = {
    id: 1,
    user_id: 1,
    token_hash: "hashed-token",
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
    created_at: new Date(),
    revoked_at: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUserRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      createRefreshToken: jest.fn(),
      findRefreshToken: jest.fn(),
      revokeRefreshToken: jest.fn(),
      revokeAllUserTokens: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    // Injecter le mock dans AuthService
    (UserRepository as jest.Mock).mockImplementation(() => mockUserRepository);
    authService = new AuthService();
  });

  describe("register", () => {
    it("devrait inscrire un nouvel utilisateur et retourner des tokens", async () => {
      const input: RegisterInput = {
        email: "newuser@example.com",
        password: "password123",
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockUser);
      mockUserRepository.createRefreshToken.mockResolvedValue(mockRefreshToken);

      const result = await authService.register(input);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        input.email,
        expect.stringContaining("::"),
      );
      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(typeof result.accessToken).toBe("string");
      expect(typeof result.refreshToken).toBe("string");
    });

    it("devrait lancer une erreur si l'email existe déjà", async () => {
      const input: RegisterInput = {
        email: "existing@example.com",
        password: "password123",
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(authService.register(input)).rejects.toThrow(BadRequestError);
      await expect(authService.register(input)).rejects.toThrow("Un compte avec cet email existe déjà");
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it("devrait hasher le mot de passe avant de le stocker", async () => {
      const input: RegisterInput = {
        email: "newuser@example.com",
        password: "password123",
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockUser);
      mockUserRepository.createRefreshToken.mockResolvedValue(mockRefreshToken);

      await authService.register(input);

      const createCall = mockUserRepository.create.mock.calls[0];
      const storedHash = createCall[1] as string;

      expect(storedHash).toContain("::");
      expect(verifyPassword(input.password, storedHash)).toBe(true);
    });
  });

  describe("login", () => {
    it("devrait authentifier un utilisateur valide et retourner des tokens", async () => {
      const input: LoginInput = {
        email: "test@example.com",
        password: "password123",
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockUserRepository.createRefreshToken.mockResolvedValue(mockRefreshToken);

      const result = await authService.login(input);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
    });

    it("devrait lancer une erreur si l'email n'existe pas", async () => {
      const input: LoginInput = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login(input)).rejects.toThrow(UnauthorizedError);
      await expect(authService.login(input)).rejects.toThrow("Email ou mot de passe incorrect");
    });

    it("devrait lancer une erreur si le mot de passe est incorrect", async () => {
      const input: LoginInput = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(authService.login(input)).rejects.toThrow(UnauthorizedError);
      await expect(authService.login(input)).rejects.toThrow("Email ou mot de passe incorrect");
    });
  });

  describe("refresh", () => {
    it("devrait générer une nouvelle paire de tokens avec un refresh token valide", async () => {
      const oldRefreshToken = signToken(
        { userId: 1, email: "test@example.com" },
        process.env.JWT_REFRESH_SECRET!,
        1209600,
      );

      mockUserRepository.findRefreshToken.mockResolvedValue(mockRefreshToken);
      mockUserRepository.revokeRefreshToken.mockResolvedValue();
      mockUserRepository.createRefreshToken.mockResolvedValue(mockRefreshToken);

      const result = await authService.refresh(oldRefreshToken);

      expect(mockUserRepository.findRefreshToken).toHaveBeenCalled();
      expect(mockUserRepository.revokeRefreshToken).toHaveBeenCalled();
      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
    });

    it("devrait lancer une erreur si le token est invalide", async () => {
      const invalidToken = "invalid.token.here";

      await expect(authService.refresh(invalidToken)).rejects.toThrow(UnauthorizedError);
      await expect(authService.refresh(invalidToken)).rejects.toThrow("Token invalide ou expiré");
    });

    it("devrait lancer une erreur si le token n'existe pas en base", async () => {
      const validToken = signToken(
        { userId: 1, email: "test@example.com" },
        process.env.JWT_REFRESH_SECRET!,
        1209600,
      );

      mockUserRepository.findRefreshToken.mockResolvedValue(null);

      await expect(authService.refresh(validToken)).rejects.toThrow(UnauthorizedError);
      await expect(authService.refresh(validToken)).rejects.toThrow("Token invalide ou révoqué");
    });

    it("devrait révoquer l'ancien token avant de créer le nouveau", async () => {
      const oldRefreshToken = signToken(
        { userId: 1, email: "test@example.com" },
        process.env.JWT_REFRESH_SECRET!,
        1209600,
      );

      mockUserRepository.findRefreshToken.mockResolvedValue(mockRefreshToken);
      mockUserRepository.revokeRefreshToken.mockResolvedValue();
      mockUserRepository.createRefreshToken.mockResolvedValue(mockRefreshToken);

      await authService.refresh(oldRefreshToken);

      // Vérifier que revokeRefreshToken est appelé avant createRefreshToken
      const revokeCallOrder = (mockUserRepository.revokeRefreshToken as jest.Mock).mock.invocationCallOrder[0];
      const createCallOrder = (mockUserRepository.createRefreshToken as jest.Mock).mock.invocationCallOrder[0];
      expect(revokeCallOrder).toBeLessThan(createCallOrder);
    });
  });

  describe("logout", () => {
    it("devrait révoquer le refresh token fourni", async () => {
      const refreshToken = signToken(
        { userId: 1, email: "test@example.com" },
        process.env.JWT_REFRESH_SECRET!,
        1209600,
      );

      const mockRequest = {
        body: { refreshToken },
      } as any;

      mockUserRepository.revokeRefreshToken.mockResolvedValue();

      await authService.logout(mockRequest);

      expect(mockUserRepository.revokeRefreshToken).toHaveBeenCalled();
    });

    it("ne devrait rien faire si aucun refresh token n'est fourni", async () => {
      const mockRequest = {
        body: {},
      } as any;

      await authService.logout(mockRequest);

      expect(mockUserRepository.revokeRefreshToken).not.toHaveBeenCalled();
    });

    it("ne devrait rien faire si le refresh token est vide", async () => {
      const mockRequest = {
        body: { refreshToken: "" },
      } as any;

      await authService.logout(mockRequest);

      expect(mockUserRepository.revokeRefreshToken).not.toHaveBeenCalled();
    });
  });
});

