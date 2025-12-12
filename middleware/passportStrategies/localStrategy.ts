import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmailIdAndPassword, getUserById} from "../../controllers/userController";
import { PassportStrategy } from '../../interfaces/index';

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    try {
      const user = getUserByEmailIdAndPassword(email, password);
      done(null, user);
    } catch(error: any) {
      done(null, false, {
        message: error.message,
      });
    }  
  }
);

/*
FIX ME (types) 😭
*/
passport.serializeUser((user: Express.User, done: (err: any, id?: string) => void) => {
  done(null, user.id);
});

/*
FIX ME (types) 😭
*/
passport.deserializeUser((id: string, done: (err: any, user?: Express.User) => void) => {
  let user = getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" });
  }
});

const passportLocalStrategy: PassportStrategy = {
  name: 'local',
  strategy: localStrategy,
};

export default passportLocalStrategy;
