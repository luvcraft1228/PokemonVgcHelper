import { Component, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { AuthService, LoginCredentials } from '../../../core/services/auth.service';

/**
 * Composant de connexion utilisateur.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  // Signals computed pour les erreurs de formulaire
  emailError = computed(() => {
    const emailControl = this.loginForm.get('email');
    if (!emailControl?.touched) {
      return null;
    }
    if (emailControl.hasError('required')) {
      return 'L\'email est requis';
    }
    if (emailControl.hasError('email')) {
      return 'Format d\'email invalide';
    }
    return null;
  });

  passwordError = computed(() => {
    const passwordControl = this.loginForm.get('password');
    if (!passwordControl?.touched) {
      return null;
    }
    if (passwordControl.hasError('required')) {
      return 'Le mot de passe est requis';
    }
    if (passwordControl.hasError('minlength')) {
      return 'Le mot de passe doit contenir au moins 8 caractères';
    }
    return null;
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  /**
   * Gère la soumission du formulaire de connexion.
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const credentials: LoginCredentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || 'Erreur lors de la connexion');
      },
    });
  }
}

