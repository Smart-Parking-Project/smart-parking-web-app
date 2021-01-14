import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link as RouterLink } from "react-router-dom";
import validate from "./LoginFormValidationRules";
import useForm from "./useForm";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}

function changeValue(e, type) {
  const { value } = e.target;
  const nextState = {};
  nextState[type] = value;
  this.setState(nextState);
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function login() {
  console.log("No errors, submit callback called!");
}

export default function SignUp() {
  const classes = useStyles();
  const [userInput, setUserInput] = useState("");
  const inputchangehandler = (event) => {
    setUserInput(event.target.value);
  };
  const { values, errors, handleChange, handleSubmit } = useForm(
    login,
    validate
  );

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <img
          src={`${process.env.PUBLIC_URL}/carlogo.png`}
          alt="Logo"
          width="400"
          height="150"
        />

        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                className={`input ${errors.username && "is-danger"}`}
                variant="outlined"
                margin="normal"
                type="username"
                required
                fullWidth
                id="username"
                label="User Name"
                name="username"
                onChange={handleChange}
                value={values.username || ""}
                autoFocus
              />
              {errors.username && (
                <p className="help is-danger">{errors.username}</p>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                className={`input ${errors.email && "is-danger"}`}
                type="email"
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleChange}
                value={values.email || ""}
              />
              {errors.email && <p className="help is-danger">{errors.email}</p>}
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                className={`input ${errors.password && "is-danger"}`}
                onChange={handleChange}
                value={values.password || ""}
              />
              {errors.password && (
                <p className="help is-danger">{errors.password}</p>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirmpassword"
                label="Confirm Password"
                type="password"
                id="confirmpassword"
                onChange={handleChange}
                value={values.confirmpassword || ""}
              />
              {errors.password && (
                <p className="help is-danger">{errors.password}</p>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                fullWidth
                id="firstName"
                label="First Name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="button is-block is-info is-fullwidth"
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/#" variant="body2" component={RouterLink} to="/">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
