import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import styles from "../styles/Home.module.css";
import Router from "next/router";

const LOGIN = gql`
  mutation loginWithEmailPass($email: String!, $password: String!) {
    loginWithEmailPass(email: $email, password: $password) {
      access_token
      refresh_token
    }
  }
`;

const REFRESH_TOKEN = gql`
  mutation {
    refreshTokens {
      access_token
      refresh_token
    }
  }
`;

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [login] = useMutation(LOGIN);

  const [refreshToken] = useMutation(REFRESH_TOKEN);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ variables: { email, password } })
      .then((res) => {
        console.log(res);
        localStorage.setItem(
          "access_token",
          "Bearer " + res.data.loginWithEmailPass.access_token
        );

        localStorage.setItem(
          "refresh_token",
          "Bearer " + res.data.loginWithEmailPass.refresh_token
        );
        Router.push("/user");
      })
      .catch((error) => {
        console.log(error.message);
        setError(error.message);
      });
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Login</h1>
        <form onSubmit={handleFormSubmit}>
          <input
            placeholder="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <input
            placeholder="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <button className={styles.btn}>Sign In</button>
        </form>
        <p style={{ color: "#C41E3A" }}>{error}</p>
      </main>
    </div>
  );
};

export default Home;
