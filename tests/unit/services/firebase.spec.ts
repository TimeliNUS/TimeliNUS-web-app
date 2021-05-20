import { register, signIn } from "@/services/firebaseService";
import firebase from "firebase";
import User = firebase.User;

describe("firebase service", () => {
  describe("register user", () => {
    it("register", async () => {
      const testRegisterUser: User | null = await register("test@123.com", "testing123");
      expect(testRegisterUser).toBeTruthy();
    });
  });
  describe("sign in use", () => {
    it("sign in", async () => {
      const testSignInUser: User | null = await signIn("test@123.com", "testing123");
      expect(testSignInUser).toBeTruthy();
    });
  });
});
