chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

const extensions = 'https://developer.chrome.com/docs/extensions/chrome'
const webstore = 'https://developer.chrome.com/docs/webstore'

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith(extensions) || tab.url.startsWith(webstore)) {
    //retrieve action badge to check on or off
    const prevState = await chrome.action.getBadgeText({tabId: tab.id});
    const nextState = prevState === 'ON' ? 'OFF' : 'ON'

    //set action badge to new state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });
  }
});