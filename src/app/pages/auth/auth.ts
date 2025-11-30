import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss']
})
export class Auth {
  isLoginMode = signal(true);
  isLoading = signal(false);
  errorMessage = signal('');
  showVerificationMessage = signal(false);

  authForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.authForm = this.createForm();
    
    effect(() => {
      this.updateValidators();
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  private updateValidators() {
    const nameControl = this.authForm.get('name');
    
    if (this.isLoginMode()) {
      nameControl?.clearValidators();
    } else {
      nameControl?.setValidators([Validators.required]);
    }
    
    nameControl?.updateValueAndValidity();
  }

  switchToLogin() {
    this.isLoginMode.set(true);
    this.errorMessage.set('');
    this.showVerificationMessage.set(false);
    this.authForm.reset();
  }

  switchToRegister() {
    this.isLoginMode.set(false);
    this.errorMessage.set('');
    this.showVerificationMessage.set(false);
    this.authForm.reset();
  }

  showError(controlName: string): boolean {
    const control = this.authForm.get(controlName);
    
    if (this.isLoginMode() && controlName === 'name') {
      return false;
    }
    
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isFormValid(): boolean {
    if (this.isLoginMode()) {
      const emailValid = this.authForm.get('email')?.valid;
      const passwordValid = this.authForm.get('password')?.valid;
      return !!emailValid && !!passwordValid;
    } else {
      return this.authForm.valid;
    }
  }

  async onSubmit() {
    if (!this.isFormValid()) {
      this.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const { name, email, password } = this.authForm.value;

      if (this.isLoginMode()) {
        await this.authService.login(email, password);
        this.router.navigate(['/client']);
      } else {
        await this.authService.register(name, email, password);
        this.showVerificationMessage.set(true);
      }
    } catch (error: any) {
      this.handleError(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private markAllAsTouched() {
    Object.keys(this.authForm.controls).forEach(key => {
      const control = this.authForm.get(key);
      if (this.isLoginMode() && key === 'name') {
        return;
      }
      control?.markAsTouched();
    });
  }

  private handleError(error: any) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        this.errorMessage.set('Este email já está em uso.');
        break;
      case 'auth/invalid-email':
        this.errorMessage.set('Email inválido.');
        break;
      case 'auth/weak-password':
        this.errorMessage.set('Senha muito fraca.');
        break;
      case 'auth/user-not-found':
        this.errorMessage.set('Usuário não encontrado.');
        break;
      case 'auth/wrong-password':
        this.errorMessage.set('Senha incorreta.');
        break;
      case 'auth/too-many-requests':
        this.errorMessage.set('Muitas tentativas. Tente novamente mais tarde.');
        break;
      default:
        this.errorMessage.set('Erro ao processar solicitação. Tente novamente.');
    }
  }

  async resendVerification() {
    try {
      await this.authService.resendEmailVerification();
      alert('Email de verificação reenviado!');
    } catch (error) {
      this.errorMessage.set('Erro ao reenviar verificação.');
    }
  }
}