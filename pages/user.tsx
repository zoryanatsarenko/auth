import { gql, useMutation, useQuery } from "@apollo/client";
import styles from "../styles/Home.module.css";
import Router from "next/router";
import { useEffect, useState } from "react";

const CURRENT_USER = gql`
  query {
    getCurrentUser {
      email
      first_name
      last_name
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

const User = () => {
  const { data, loading, error } = useQuery(CURRENT_USER, {});
  const [newToken, setNewToken] = useState("");
  const [refreshToken, { data: rData, loading: rLoading, error: rError }] =
    useMutation(REFRESH_TOKEN, {
      context: {
        headers: {
          authorization: newToken,
        },
      },
    });

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    Router.push("/");
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>{error.message}</h1>;
  }

  if (data) {
    const { first_name, last_name } = data.getCurrentUser;
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1>
            <span style={{ color: "#aaa" }}>Logged in as </span>
            {first_name} {last_name}
          </h1>
          <button className={styles.btn} onClick={() => logout()}>
            Log out
          </button>
        </main>
      </div>
    );
  }
};

export default User;
