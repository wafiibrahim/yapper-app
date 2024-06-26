import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { createContext, useEffect, useState, useContext } from "react";
import { auth, db } from '../firebaseConfig'; // Ensure correct path to firebaseConfig.js

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    return () => unsub();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in user:', response.user);
      return { success: true, data: response.user };
    } catch (error) {
      let msg = error.message;
      
      if (msg.includes('(auth/user-not-found)')) {
        msg = 'No user found with this email.';
      } else if (msg.includes('(auth/wrong-password)')) {
        msg = 'Incorrect password.';
      } else if (msg.includes('(auth/invalid-email)')) {
        msg = 'Invalid email address.';
      }

      return { success: false, msg: msg };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error("Logout error: ", error);
      return { success: false, msg: error.message };
    }
  };

  const register = async (email, password, username, profileUrl) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log('response.user:', response?.user);

      await setDoc(doc(db, "users", response?.user?.uid), {
        username,
        profileUrl,
        userId: response?.user?.uid,
      });

      return { success: true, data: response?.user };
    } catch (error) {
      let msg = error.message;
      
      console.error("Registration error: ", error);

      if (msg.includes('(auth/email-already-in-use)')) {
        msg = 'This email is already in use.';
      } else if (msg.includes('(auth/invalid-email)')) {
        msg = 'Invalid email address.';
      } else if (msg.includes('(auth/operation-not-allowed)')) {
        msg = 'Operation not allowed. Please contact support.';
      } else if (msg.includes('(auth/weak-password)')) {
        msg = 'Password is too weak.';
      } else if (msg.includes('(auth/admin-restricted-operation)')) {
        msg = 'Restricted operation.';
      }

      return { success: false, msg: msg };
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be wrapped inside AuthContextProvider');
  }

  return value;
};
