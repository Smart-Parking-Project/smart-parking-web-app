import React, { useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import { CREATE_NEW_USER } from "../graphql/mutations";
import { useForm } from "../util/hooks";

function Register(props) {
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const [addUser, { loading }] = useMutation(CREATE_NEW_USER, {
    update(_, result) {
      props.history.push("/dashboard");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function registerUser() {
    addUser();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Register</h1>
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
          label="Email"
          placeholder="Email"
          name="email"
          type="email"
          error={!!errors.email}
          value={values.email}
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
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password"
          name="confirmPassword"
          type="password"
          error={!!errors.confirmPassword}
          value={values.confirmPassword}
          onChange={onChange}
        />
        <Form.Input
          label="First Name"
          placeholder="First Name"
          name="firstName"
          type="text"
          value={values.firstName}
          onChange={onChange}
        />
        <Form.Input
          label="Last Name"
          placeholder="Last Name"
          name="lastName"
          type="text"
          value={values.lastName}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Register
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

export default Register;
