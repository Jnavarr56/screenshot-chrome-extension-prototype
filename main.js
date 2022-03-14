const { action, tabs } = chrome;

const ON_ICON_IMAGE_PATH = `/images/on-button32.png`;
const OFF_ICON_IMAGE_PATH = `/images/off-button32.png`;

const tabsWithExtensionOnIds = new Set();

const isExtensionOnForTab = (tabId) => tabsWithExtensionOnIds.has(tabId);

const setIconToOnDisplay = (tabId) =>
  action.setBadgeText({ text: "ON", tabId });

const setIconToOffDisplay = (tabId) =>
  action.setBadgeText({ text: "OFF", tabId });

const turnOnExtensionForTab = async (tabId) => {
  tabsWithExtensionOnIds.add(tabId);
  await setIconToOnDisplay(tabId);
};

const turnOffExtensionForTab = async (tabId) => {
  tabsWithExtensionOnIds.delete(tabId);
  await setIconToOffDisplay(tabId);
};

const toggleExtensionOnForTab = async (tabId) => {
  if (isExtensionOnForTab(tabId)) {
    return await turnOffExtensionForTab(tabId);
  }

  await turnOnExtensionForTab(tabId);
};

const turnOffExtensionsForAllTabs = async () => {
  await Promise.all(
    Array.from(tabsWithExtensionOnIds.values()).map((tabId) =>
      turnOffExtensionForTab(tabId)
    )
  );
};

const assumeExtensionOnStateForTab = async (tabId) => {
  if (isExtensionOnForTab(tabId)) {
    return await setIconToOnDisplay(tabId);
  }
  await setIconToOffDisplay(tabId);
};

const handleExtensionIconClicked = async ({ id: activeTabId }) => {
  await toggleExtensionOnForTab(activeTabId);
};

const handleActiveTabChanged = async ({ tabId: activeTabId }) => {
  await assumeExtensionOnStateForTab(activeTabId);
};

action.onClicked.addListener(handleExtensionIconClicked);
tabs.onActivated.addListener(handleActiveTabChanged);
