import { Component, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, RegisterCredentials } from '../../../core/services/auth.service';
import { SharedModule } from '../../../shared/shared.module';

/**
 * Validateur personnalisé pour vérifier que les mots de passe correspondent.
 */
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

/**
 * Composant d'inscription utilisateur.
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, SharedModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  // Signals computed pour les erreurs de formulaire
  emailError = computed(() => {
    const emailControl = this.registerForm.get('email');
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
    const passwordControl = this.registerForm.get('password');
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

  confirmPasswordError = computed(() => {
    const confirmPasswordControl = this.registerForm.get('confirmPassword');
    if (!confirmPasswordControl?.touched) {
      return null;
    }
    if (confirmPasswordControl.hasError('required')) {
      return 'La confirmation du mot de passe est requise';
    }
    if (this.registerForm.hasError('passwordMismatch')) {
      return 'Les mots de passe ne correspondent pas';
    }
    return null;
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator }
    );
  }

  /**
   * Gère la soumission du formulaire d'inscription.
   */
  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const credentials: RegisterCredentials = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    };

    this.authService.register(credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || 'Erreur lors de l\'inscription');
      },
    });
  }
}

