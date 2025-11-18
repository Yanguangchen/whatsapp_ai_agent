(() => {
  const ORIGINAL_TEXT = "ChatGPT can make mistakes. Check important info.";
  const REPLACEMENT_TEXT = "Web Wizards Agent Loaded, ChatGPT can still make mistakes, Check important info";
  const TARGET_CLASS = "pointer-events-auto";
  const HEADER_CLASS_SELECTOR = ".text-token-text-primary.px-3.text-lg";
  const HEADER_REPLACEMENT_TEXT = "Web Wizards AI Agent";
  const HEADER_BANNER_ID = "web-wizards-ai-agent-banner";
  const HEADER_BANNER_TEXT = "Web Wizards AI Agent Loaded";
  const HEADER_BANNER_FONT_SIZE = "14px";

  function isElementWithTargetClass(node) {
    if (!(node instanceof Element)) return false;
    return node.classList.contains(TARGET_CLASS);
  }

  function findClosestTargetAncestor(node) {
    let current = node instanceof Element ? node : node.parentElement;
    while (current) {
      if (isElementWithTargetClass(current)) return current;
      current = current.parentElement;
    }
    return null;
  }

  function replaceInTextNode(textNode) {
    if (textNode.nodeType !== Node.TEXT_NODE) return false;
    const value = textNode.nodeValue || "";
    if (!value.includes(ORIGINAL_TEXT)) return false;
    const ancestor = findClosestTargetAncestor(textNode);
    if (!ancestor) return false;
    textNode.nodeValue = value.replaceAll(ORIGINAL_TEXT, REPLACEMENT_TEXT);
    return true;
  }

  function walkAndReplace(root) {
    const treeWalker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          return (node.nodeValue && node.nodeValue.includes(ORIGINAL_TEXT))
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      }
    );
    let replacedAny = false;
    let currentNode = treeWalker.nextNode();
    while (currentNode) {
      replacedAny = replaceInTextNode(currentNode) || replacedAny;
      currentNode = treeWalker.nextNode();
    }
    return replacedAny;
  }

  function replaceHeaderClassText(root) {
    const rootElement = root instanceof Element ? root : document;
    let changed = false;

    if (rootElement instanceof Element && rootElement.matches && rootElement.matches(HEADER_CLASS_SELECTOR)) {
      if (rootElement.textContent !== HEADER_REPLACEMENT_TEXT) {
        rootElement.textContent = HEADER_REPLACEMENT_TEXT;
        changed = true;
      }
    }

    if (rootElement.querySelectorAll) {
      const nodes = rootElement.querySelectorAll(HEADER_CLASS_SELECTOR);
      nodes.forEach((el) => {
        if (el.textContent !== HEADER_REPLACEMENT_TEXT) {
          el.textContent = HEADER_REPLACEMENT_TEXT;
          changed = true;
        }
      });
    }

    return changed;
  }

  function replaceNow() {
    try {
      walkAndReplace(document.body);
      replaceHeaderClassText(document);
      ensureHeaderBannerPresent();
    } catch {
      // Intentionally ignore errors to avoid breaking the page.
    }
  }

  function ensureHeaderBannerPresent() {
    try {
      if (!document || !document.body) return;
      const existing = document.getElementById(HEADER_BANNER_ID);
      if (existing) {
        existing.style.fontSize = HEADER_BANNER_FONT_SIZE;
        existing.style.textAlign = "center";
        existing.style.paddingTop = "8px";
        existing.style.paddingBottom = "8px";
        return;
      }
      const h1 = document.createElement("h1");
      h1.id = HEADER_BANNER_ID;
      h1.textContent = HEADER_BANNER_TEXT;
      h1.style.fontSize = HEADER_BANNER_FONT_SIZE;
      h1.style.textAlign = "center";
      h1.style.paddingTop = "8px";
      h1.style.paddingBottom = "8px";
      document.body.prepend(h1);
    } catch {
      // Ignore errors to avoid breaking the page.
    }
  }

  function startObserver() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((added) => {
            if (added.nodeType === Node.TEXT_NODE) {
              replaceInTextNode(added);
            } else if (added.nodeType === Node.ELEMENT_NODE) {
              // Fast path: if the added element has the target class, scan inside it.
              const element = added;
              if (element.classList && element.classList.contains(TARGET_CLASS)) {
                walkAndReplace(element);
              } else {
                // Otherwise, only scan if relevant text likely exists.
                if (element.textContent && element.textContent.includes(ORIGINAL_TEXT)) {
                  walkAndReplace(element);
                }
              }
              // Update header text for matching class additions.
              replaceHeaderClassText(element);
            }
          });
        } else if (mutation.type === "characterData" && mutation.target.nodeType === Node.TEXT_NODE) {
          replaceInTextNode(mutation.target);
          const parent = mutation.target.parentElement;
          if (parent) {
            const headerAncestor = parent.closest && parent.closest(HEADER_CLASS_SELECTOR);
            if (headerAncestor) {
              replaceHeaderClassText(headerAncestor);
            }
          }
        }
      }
      ensureHeaderBannerPresent();
    });

    observer.observe(document.documentElement || document, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      replaceNow();
      startObserver();
    });
  } else {
    replaceNow();
    startObserver();
  }
})();


