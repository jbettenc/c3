export function loadState(): any | undefined {
  try {
    const serializedState = localStorage.getItem("state");
    if (!serializedState) {
      return undefined;
    }
    const json = JSON.parse(serializedState);

    // Clear "Back" button state
    if (json?.navigation) {
      json.navigation.previousEndpoint = undefined;
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
