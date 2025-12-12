import express, { Request, Response } from "express";
import passport from 'passport';
import { forwardAuthenticated } from "../middleware/checkAuth";

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => {
  const messages = req.session.messages || [];
  res.render("login", { messages });
});

router.get("/github", forwardAuthenticated, (req, res) => {
  passport.authenticate('github', { scope: [ 'user:email' ] });
});

router.get("/github/callback", forwardAuthenticated, (req, res) => {
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req: Request, res: Response) {
    // Successful authentication, redirect home
    res.redirect("/");
}});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login/",
    /* FIX ME: 😭 failureMsg needed when login fails */
    failureMessage: true,
  })
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

export default router;
