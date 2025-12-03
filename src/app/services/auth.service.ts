// auth.service.ts
import { Injectable } from '@angular/core';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
} from "firebase/auth";
import { app } from '../firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = getAuth(app);
  currentUser: User | null = null;

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
    });
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(name: string, email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    
    await updateProfile(userCredential.user, {
      displayName: name
    });

    // Enviar verificação por email
    await sendEmailVerification(userCredential.user);

    return userCredential;
  }

  logout() {
    return signOut(this.auth);
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  getUser() {
    return this.currentUser;
  }

  getUserName(): string {
    return this.currentUser?.displayName || this.currentUser?.email?.split('@')[0] || 'Usuário';
  }

  getUserId():string{
    return this.currentUser?.uid || '';
  }

  isEmailVerified(): boolean {
    return this.currentUser?.emailVerified || false;
  }

  // Método para reenviar verificação de email
  async resendEmailVerification() {
    if (this.currentUser) {
      await sendEmailVerification(this.currentUser);
    }
  }
}