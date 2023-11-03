export function loadState(): any | undefined {
  try {
    const serializedState = localStorage.getItem("state");
    if (!serializedState) {
      return undefined;
    }
    const json = JSON.parse(serializedState);

    // We will cache ENS data for 1 day locally to prevent 429s.
    if (json?.ens?.ensState) {
      for (const key of Object.keys(json.ens.ensState)) {
        if (json.ens.ensState[key].timestamp < Date.now() - 86400000) {
          delete json.ens[key];
        }
      }
    }
    if (json?.ens?.ensMutex) {
      json.ens.ensMutex = {};
    }
    return json;
  } catch (err) {
    return undefined;
  }
}

export function saveState(state: any): void {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (err) {
    // Ignore write errors. The app will initialize just fine.
  }
}
