"use client";

import styles from "./page.module.css";
import { VariantList } from "@/app/variant";
import {
  AuthenticatedTemplate,
  MsalProvider,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { EventType } from "@azure/msal-browser";
import { msalInstance } from "@/app/msalInstance";

msalInstance.initialize().then(() => {
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  msalInstance.addEventCallback((event) => {
    // Types are outdated: Event payload is an object with account, token, etc
    //@ts-ignore
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
      //@ts-ignore
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
            <VariantList />
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
            <button onClick={loginRedirect}>Log in</button>
          </UnauthenticatedTemplate>
        </div>
      </main>
    </MsalProvider>
  );
}
