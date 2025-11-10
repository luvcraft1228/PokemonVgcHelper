import type { Request, Response } from "express";
import { BadRequestError } from "../../shared/http-error";

// Mock du service avant l'import du controller
const mockRegister = jest.fn();
const mockLogin = jest.fn();
const mockRefresh = jest.fn();
const mockLogout = jest.fn();

jest.mock("../../services/auth.service", () => {
  return {
    AuthService: jest.fn().mockImplementation(() => ({
      register: mockRegister,
      login: mockLogin,
      refresh: mockRefresh,
      logout: mockLogout,
    })),
  };
});

// Importer le controller après le mock
import { registerController, loginController, refreshController, logoutController } from "../auth.controller";

describe("AuthController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  describe("registerController", () => {
    it("devrait inscrire un utilisateur avec des credentials valides", async () => {
      const tokens = {
        accessToken: "access-token",
        refreshToken: "refresh-token",
      };

      mockRequest.body = {
        email: "test@example.com",
        password: "password123",
      };

      mockRegister.mockResolvedValue(tokens);

      await registerController(mockRequest as Request, mockResponse as Response);

      expect(mockRegister).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(tokens);
    });

    it("devrait lancer une erreur si l'email est manquant", async () => {
      mockRequest.body = {
        password: "password123",
      };

      await expect(
        registerController(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow(BadRequestError);
      await expect(
        registerController(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow("Le champ email est requis");

      expect(mockRegister).not.toHaveBeenCalled();
    });

    it("devrait lancer une erreur si l'email est vide", async () => {
      mockRequest.body = {
        email: "",
        password: "password123",
      };

      await expect(
        registerController(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow(BadRequestError);
      await expect(
        registerController(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow("Le champ email est requis");
    });

    it("devrait lancer une erreur si le mot de passe est manquant", async () => {
      mockRequest.body = {
        email: "test@example.com",
      };

      await expect(
        registerController(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow(BadRequestError);
      await expect(
        registerController(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow("Le mot de passe doit contenir au moins 8 caractères");
    });

    it("devrait lancer une erreur si le mot de passe est trop court", async () => {
      mockRequest.body = {
        email: "test@example.com",
        password: "short",
      };

      await expect(
        registerController(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow(BadRequestError);
      await expect(
        registerController(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow("Le mot de passe doit contenir au moins 8 caractères");
    });
  });

  describe("loginController", () => {
    it("devrait authentifier un utilisateur avec des credentials valides", async () => {
      const tokens = {
        accessToken: "access-token",
        refreshToken: "refresh-token",
      };

      mockRequest.body = {
        email: "test@example.com",
        password: "password123",
      };

      mockLogin.mockResolvedValue(tokens);

      await loginController(mockRequest as Request, mockResponse as Response);

      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(tokens);
    });

    it("devrait lancer une erreur si l'email est manquant", async () => {
      mockRequest.body = {
        password: "password123",
      };

      await expect(
        loginController(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow(BadRequestError);
      await expect(
        loginController(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow("Le champ email est requis");
    });

    it("devrait lancer une erreur si le mot de passe est trop court", async () => {
      mockRequest.body = {
        email: "test@example.com",
        password: "short",
      };

      await expect(
        loginController(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe("refreshController", () => {
    it("devrait rafraîchir les tokens avec un refresh token valide", async () => {
      const tokens = {
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
      };

      mockRequest.body = {
        refreshToken: "valid-refresh-token",
      };

      mockRefresh.mockResolvedValue(tokens);

      await refreshController(mockRequest as Request, mockResponse as Response);

      expect(mockRefresh).toHaveBeenCalledWith("valid-refresh-token");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(tokens);
    });

    it("devrait lancer une erreur si le refresh token est manquant", async () => {
      mockRequest.body = {};

      await expect(
        refreshController(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow(BadRequestError);
      await expect(
        refreshController(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow("Le refresh token est requis");

      expect(mockRefresh).not.toHaveBeenCalled();
    });

    it("devrait lancer une erreur si le refresh token est vide", async () => {
      mockRequest.body = {
        refreshToken: "",
      };

      await expect(
        refreshController(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow(BadRequestError);
      await expect(
        refreshController(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow("Le refresh token est requis");
    });

    it("devrait lancer une erreur si le refresh token n'est pas une string", async () => {
      mockRequest.body = {
        refreshToken: 12345,
      };

      await expect(
        refreshController(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe("logoutController", () => {
    it("devrait déconnecter un utilisateur et retourner 204", async () => {
      mockRequest.body = {
        refreshToken: "refresh-token",
      };

      mockLogout.mockResolvedValue();

      await logoutController(mockRequest as Request, mockResponse as Response);

      expect(mockLogout).toHaveBeenCalledWith(mockRequest);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it("devrait fonctionner même sans refresh token", async () => {
      mockRequest.body = {};

      mockLogout.mockResolvedValue();

      await logoutController(mockRequest as Request, mockResponse as Response);

      expect(mockLogout).toHaveBeenCalledWith(mockRequest);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
    });
  });
});

