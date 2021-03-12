import React, { useState, useContext } from "react";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import { AUTHENTICATE_USER } from "../graphql/mutations";
import { useForm } from "../util/authHooks";
import { AuthContext } from "../context/auth";
import MenuBar from "../components/MenuBar";


function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });

  const [loginUser, { loading }] = useMutation(AUTHENTICATE_USER, {
    update(_, { data: { authenticateUser: userData } }) {
      
      context.login(userData);
      props.history.push("/dash");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className="form-container">
      <MenuBar/>
      <Form onSubmit={onSubmit} noValidate className="">
        <h1>Login</h1>
        <Form.Input
          label="Username"
          placeholder="Username"
          name="username"
          type="text"
          error={!!errors.username}
          value={values.username}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password"
          name="password"
          type="password"
          error={!!errors.password}
          value={values.password}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div>
          <ul className="ui error message">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Login;
