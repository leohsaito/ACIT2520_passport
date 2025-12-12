import passport from "passport";
import { Strategy as GitHubStrategy } from 'passport-github2';
import { PassportStrategy } from '../../interfaces/index';
import { Request } from 'express';
import { Profile } from 'passport';
import { database, userModel } from '../../models/userModel';
import dotenv from "dotenv";
dotenv.config();

const githubStrategy: GitHubStrategy = new GitHubStrategy (
    {
        clientID: process.env.CLIENT_ID as string,
        clientSecret: process.env.CLIENT_SECRET as string,
        callbackURL: "http://127.0.0.1:3000/auth/github/callback",
        passReqToCallback: true,
    },
    
    /* FIX ME 😭 */
    async (req: Request, accessToken: string, refreshToken: string, profile: Profile, done: any) => {
        const user = await findOrCreate(profile); 
        return done(null, user);
    }
);

async function findOrCreate(profile: Profile) {
    const user = userModel.findById(profile.id);
    // check in case there is no match
    if (user === false) {
        const newUser = {id: profile.id, name: profile.displayName, role: "user"};
        database.push(newUser);
        return newUser;
    }
    return user;
}

const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

passport.use(passportGitHubStrategy.name, passportGitHubStrategy.strategy);

export default passportGitHubStrategy;
