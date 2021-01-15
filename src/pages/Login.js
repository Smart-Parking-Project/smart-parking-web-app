import React, { useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { useQuery } from "@apollo/client";
import { AUTHENTICATE_USER } from "../graphql/queries";
import { useForm } from "../util/hooks";

function Login(props) {
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });

  //   const [loginUser, { loading }] = useQuery(AUTHENTICATE_USER, {
  //     update(_, result) {
  //       props.history.push("/");
  //     },
  //     onError(err) {
  //       setErrors(err.graphQLErrors[0].extensions.exception.errors);
  //     },
  //     variables: values,
  //   });

  function loginUserCallback() {
    // loginUser();
  }

  return (
    <div className="form-container">
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
