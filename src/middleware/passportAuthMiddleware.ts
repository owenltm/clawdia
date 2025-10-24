import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";

import { authUseCase } from "@/src/modules/auth/auth.usecase";

var opts: any = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'shhhhh';
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';

export const passportJwtStrategy = new JwtStrategy(
  opts,
  async function (jwt_payload, done) {
    try {
      const id = jwt_payload.sub;
      const user = await authUseCase.getUserById(id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  }
)

export const passportLocalStrategy = new LocalStrategy(
  async function (username: string, password: string, done) {
    try {
      const user = await authUseCase.login(username, password);

      if (!user) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);