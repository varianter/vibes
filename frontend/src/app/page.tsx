"use client";

//@ts-ignore
import styles from "./page.module.css";
// @ts-ignore
import { WeatherForecast } from "@/app/weather";
import {
  AuthenticatedTemplate,
  MsalProvider,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { EventType } from "@azure/msal-browser";
// @ts-ignore
import { msalInstance } from "@/app/msalInstance";

msalInstance.initialize().then(() => {
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  // @ts-ignore
  msalInstance.addEventCallback((event) => {
    // @ts-ignore
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
      // @ts-ignore
      const account = event.payload.account;
      msalInstance.setActiveAccount(account);
    }
  });
});

export default function Home() {
  function loginRedirect() {
    // TODO: Error handling, etc
    msalInstance.loginRedirect();
  }

  return (
    <MsalProvider instance={msalInstance}>
      <main className={styles.main}>
        <div className={styles.description}>
          <AuthenticatedTemplate>
            <code>
              <WeatherForecast />
            </code>
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
            <button onClick={loginRedirect}>Log in</button>
          </UnauthenticatedTemplate>
        </div>
      </main>
    </MsalProvider>
  );
}
