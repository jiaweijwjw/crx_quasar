const isWhichBodyPart = part => {
  if (part.hasAttributes()) {
    const id = part.getAttribute("id");
    const classesInNode = part.classList;
    const dir = part.getAttribute("dir");
    const tagName = part.tagName;
    console.log(tagName);
    if (classesInNode.length === 0 && dir === "auto") {
      return postBodyPartEnum.TEXT;
    } else if (id && classesInNode.length === 1) {
      if (
        id.startsWith("jsc") &&
        classesInNode.contains(CLASS_IF_IS_OWN_CONTENT_BODY_PART)
      ) {
        return postBodyPartEnum.OWN_CONTENT;
      }
    } else if (
      classesInNode.length === CLASSES_IF_IS_OTHER_FB_POST_BODY_PART.length
    ) {
      for (
        let z = CLASSES_IF_IS_OTHER_FB_POST_BODY_PART.length - 1;
        z >= 0;
        z--
      ) {
        if (!classesInNode.contains(CLASSES_IF_IS_OTHER_FB_POST_BODY_PART[z])) {
          break;
        } else if (z == 0) {
          return postBodyPartEnum.OTHER_FB_POST;
        }
      }
      return postBodyPartEnum.UNKNOWN;
    } else if (tagName === "BLOCKQUOTE") {
      return postBodyPartEnum.BLOCKQUOTE;
    } else {
      return postBodyPartEnum.UNKNOWN;
    }
  }
};

const getAllReplies = listOfReplies => {
  let replies = [];
  if (listOfReplies.length === 0) {
    return;
  } else {
    // length !== 0
    for (let i = 0; i < listOfReplies.length; i++) {
      let comment = {};
      let commentor = { name: "", fbLink: "" };
      let said = {};
      const individualCommentCommonParent = listOfReplies[i].querySelector(
        INDIVIDUAL_COMMENT_COMMON_PARENT
      );
      console.log(individualCommentCommonParent);
      if (individualCommentCommonParent) {
        const commentorNode = individualCommentCommonParent.querySelector(
          COMMENT_COMMENTOR
        );
        const saidNode = individualCommentCommonParent.querySelector(
          COMMENT_SAID
        );
        const attachedToCommentNode = listOfReplies[i].querySelector(
          COMMENT_ATTACHED
        );
        console.log(attachedToCommentNode);
        if (attachedToCommentNode) {
          const img = attachedToCommentNode.querySelector(COMMENT_ATTACHED_IMG);
          const ext_link = attachedToCommentNode.querySelector(
            COMMENT_ATTACHED_EXT_LINK
          );
          if (img) {
            said["attached"] = img.getAttribute("src");
          }
          if (ext_link) {
            said["attached"] = ext_link.getAttribute("href");
          }
          // what if got multiple sial
        }
        commentor.name =
          commentorNode.textContent || `unable to get commentor's name`;
        commentor.fbLink = commentorNode.getAttribute("href");
        if (saidNode) {
          said["text"] = saidNode.textContent;
        }
        console.log("commentor: " + commentor.name);
        comment["commentor"] = commentor;
        comment["said"] = said;
      } else {
        console.log("cant find individualCommentCommonParent");
        continue; // if dont skip this iteration, if unable to handle comment, will screw up the whole comments part. At least still can get the other comments but just skip this one buggy comment.
      }

      const moreReplies = listOfReplies[i].querySelector(
        GETALLREPLIES_MORE_REPLIES
      );
      console.log(moreReplies);
      if (!moreReplies) {
        replies.push(comment);
      } else {
        comment["replies"] = getAllReplies(moreReplies.children);
        replies.push(comment);
      }
    }
    return replies;
  }
};

const getMetaData = metaSection => {
  let metaData = {};
  let hasError = false;
  let reactionsData = { totalReactionsCount: null };
  const reactionsSection = metaSection.querySelector(META_REACTIONS_SECTION);
  const numCommentsSharesSection = metaSection.querySelector(
    META_NUM_COMMENTSSHARES_SECTION
  );
  if (reactionsSection) {
    const childrenArray = Array.from(reactionsSection.childNodes).filter(
      node =>
        node.hasChildNodes() &&
        node.classList.length === 0 &&
        node.tagName === "DIV"
    ); // childrenArray should only have the total reaction count part
    console.log(childrenArray);
    const totalReactionsCountEl = childrenArray[0].querySelector(
      META_REACTIONS_SECTION_TOTAL_REACTIONS_COUNT
    );
    if (totalReactionsCountEl) {
      let totalReactionsCount = Number(totalReactionsCountEl.textContent);
      console.log(totalReactionsCount);
      reactionsData.totalReactionsCount = totalReactionsCount;
    } else {
      console.log("Error in getting totalReactionsCount.");
      hasError = true;
    }
    const listOfReactions = reactionsSection.querySelector(
      META_LIST_OF_REACTIONS
    ).children;
    if (listOfReactions) {
      for (let r = 0; r < listOfReactions.length; r++) {
        const reactionTypeString = listOfReactions[r]
          .querySelector(META_EACH_IN_LIST_OF_REACTIONS)
          .getAttribute("aria-label");
        const reactionType = reactionTypeString.substring(
          0,
          reactionTypeString.indexOf(":")
        );
        const reactionImgSrc = listOfReactions[r]
          .querySelector(META_EACH_IN_LIST_OF_REACTIONS_IMG_SRC)
          .getAttribute("src");
        const reactionCountString = reactionTypeString.slice(
          reactionTypeString.indexOf(":") + 2 // slice() doesnt include the 'end' then an additional 1 for the space
        );
        const reactionCount = Number(
          reactionCountString.substring(0, reactionCountString.indexOf(" "))
        );
        reactionsData[reactionType] = {
          reactionCount,
          reactionImgSrc
        };
      }
    } else {
      console.log("Error in getting the list of reactions.");
      hasError = true;
    }
    metaData["reactionsData"] = reactionsData;
  } else {
    console.log("Failed to find reactionsSection.");
    hasError = true;
  }
  if (numCommentsSharesSection) {
    for (let i = 0; i < numCommentsSharesSection.children.length; i++) {
      const numString = numCommentsSharesSection.children[i].textContent;
      if (numString) {
        const splitArray = numString.split(" ");
        metaData[splitArray[1]] = Number(splitArray[0]);
      }
    }
  } else {
    console.log("Failed to find numCommentsSharesSection.");
    hasError = true;
  }
  return { metaData, hasError };
};

const renderBtnFeedback = (
  btnEl,
  addPostOutcome,
  hasErrorGettingSomeData = false
) => {
  if (addPostOutcome) {
    console.log("Successfully added this post.");
    Object.assign(btnEl.style, addPostBtnSuccessStyle);
    btnEl.textContent = "ADDED";
    if (hasErrorGettingSomeData) {
      console.log("But there was error in collecting some data.");
      Object.assign(btnEl.style, addPostBtnNotTotalSuccessStyle);
    }
  } else {
    console.log("Failed to add this post.");
    Object.assign(btnEl.style, addPostBtnFailStyle);
    btnEl.textContent = "FAILED TO ADD";
  }
};

const digestBodyText = textChild => {
  return textChild.textContent;
};

const digestBodyBlockQuote = blockQuoteChild => {
  return blockQuoteChild.querySelector(POST_BODY_BLOCK_QUOTE).textContent;
};

const digestBodyOtherFbPost = otherFbPostChild => {
  return otherFbPostChild
    .querySelector(POST_BODY_OTHER_FB_POST_LINK)
    .getAttribute("href");
};

const digestBodyOwnContent = ownContentChild => {
  const ext_link = ownContentChild.querySelector(
    POST_BODY_OWN_CONTENT_EXT_LINK
  );
  const video = ownContentChild.querySelector(POST_BODY_OWN_CONTENT_VIDEO);
  if (ext_link) {
    return ext_link.getAttribute("href");
  } else if (video) {
    return "Content is a video.";
  } else {
    return "Unknown own content.";
  }
};

const getPostData = event => {
  const btnEl = event.target;
  let top, middle, bottom;
  let author = { name: "", fbLink: "" };
  let comments = [];
  let postBody = {};
  let metaData = {};
  let hasErrorGettingSomeData = false;
  const postCommonParent = event.target.closest(POST_COMMON_PARENT);
  if (postCommonParent) {
    const childrenArray = Array.from(postCommonParent.childNodes).filter(
      node => node.hasChildNodes() && node.classList.length === 0 // filterning classList.length === 0 is to remove advertisements.
    ); // childrenArray consists of the header (top), body (middle) and footer (bottom) of a post.
    top = childrenArray[0];
    middle = childrenArray[1];
    bottom = childrenArray[2];
    if (top) {
      const authorNode = top.querySelector(POST_AUTHOR);
      if (authorNode) {
        author.name = authorNode.textContent || `Unable to get author's name.`;
        author.fbLink = authorNode.getAttribute("href");
      } else {
        author.name = `Unable to get author's name.`;
        author.fbLink = "Unable to get link to post.";
        hasErrorGettingSomeData = true;
      }
    } else {
      hasErrorGettingSomeData = true;
    }
    if (middle) {
      let part = null;
      for (let p = 0; p < middle.children.length; p++) {
        part = middle.children[p];
        const bodyPart = isWhichBodyPart(part);
        switch (bodyPart) {
          case postBodyPartEnum.TEXT:
            postBody["text"] = digestBodyText(part);
            break;
          case postBodyPartEnum.BLOCKQUOTE:
            postBody["blockQuote"] = digestBodyBlockQuote(part);
            break;
          case postBodyPartEnum.OTHER_FB_POST:
            postBody["otherFbPost"] = digestBodyOtherFbPost(part);
            break;
          case postBodyPartEnum.OWN_CONTENT:
            postBody["ownContent"] = digestBodyOwnContent(part);
            break;
          case postBodyPartEnum.UNKNOWN:
            console.log("Unknown post body part.");
            hasErrorGettingSomeData = true;
            break;
          default:
            console.log("Error detecting which post body part.");
            hasErrorGettingSomeData = true;
        }
      }
    } else {
      hasErrorGettingSomeData = true;
    }
    if (bottom) {
      const metaSection = bottom.querySelector(POST_META_SECTION);
      const commentsSection = bottom.querySelector(COMMENTS_SECTION);
      if (metaSection) {
        let metaResults = getMetaData(metaSection);
        metaData = metaResults.metaData;
        if (metaResults.hasError) {
          hasErrorGettingSomeData = true;
        }
      } else {
        console.log("Failed to find metaSection");
        hasErrorGettingSomeData = true;
      }
      console.log(metaData);
      if (commentsSection) {
        comments = getAllReplies(commentsSection.children);
      } else {
        console.log("Failed to find commentsSection.");
        console.log("Could be there are no comments on this post.");
      }
    } else {
      hasErrorGettingSomeData = true;
    }
  } else {
    console.log("Failed to find postCommonParent.");
    renderBtnFeedback(btnEl, false);
    return;
  }
  sendPostToCrx(
    author,
    postBody,
    metaData,
    comments,
    btnEl,
    hasErrorGettingSomeData
  );
};

const sendPostToCrx = (
  author,
  postBody,
  metaData,
  comments,
  btnEl,
  hasErrorGettingSomeData
) => {
  let parcel = {
    message: "new.fb.post.added",
    content: {
      author,
      postBody,
      metaData,
      comments
    }
  };
  chrome.runtime.sendMessage(parcel, res => {
    console.log(res);
    renderBtnFeedback(btnEl, res, hasErrorGettingSomeData);
    // can make use of the res to indicate to user that the post has been added. (change the el style)
  });
};

// setup the mutation observer to look for any changes in the target node (newsfeed or pagefeed)
// this is because the facebook webpage never fully loads but instead loads more posts as the user scrolls down.
// we are only interested to look at whether there are new childnodes which are fb posts.
const setupMutationObserver = (targetNode, view) => {
  const config = { childList: true };
  const callback = function(mutationRecordsArray, observer) {
    mutationRecordsArray.forEach(mutation => {
      if (mutation.addedNodes.length === 0) return; // return in a forEach() callback is equivalent to continue in a conventional for loop.
      switch (mutation.type) {
        case "childList":
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            switch (view) {
              case whichFacebookViewEnum.NEWSFEED:
                if (mutation.addedNodes[i].hasAttributes()) {
                  let attrs = mutation.addedNodes[i].attributes; // element.attributes is a NamedNodeMap, not an array.
                  for (let y = attrs.length - 1; y >= 0; y--) {
                    if (
                      attrs[y].name === "data-pagelet" &&
                      attrs[y].value === "FeedUnit_1"
                    ) {
                      break;
                    }
                    if (
                      attrs[y].name === "data-pagelet" &&
                      attrs[y].value !== "FeedUnit_1"
                    ) {
                      renderAddPostButton(
                        mutation.addedNodes[i].querySelector(POST_COMMON_PARENT)
                      );
                    }
                  }
                }
                break;
              case whichFacebookViewEnum.PAGE:
                let classesInNode = mutation.addedNodes[i].classList;
                if (classesInNode.length !== CLASSES_IF_IS_POST_ON_PAGE.length)
                  break;
                for (
                  let z = CLASSES_IF_IS_POST_ON_PAGE.length - 1;
                  z >= 0;
                  z--
                ) {
                  if (!classesInNode.contains(CLASSES_IF_IS_POST_ON_PAGE[z])) {
                    break;
                  } else if (z == 0) {
                    // all the classes present in this new addedNode matches the classes required for it to be a post.
                    renderAddPostButton(
                      mutation.addedNodes[i].querySelector(POST_COMMON_PARENT)
                    );
                  }
                }
                break;
            }
          }
          break;
      }
    });
  };
  observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
  // observer.disconnect(); where to add this disconnect?
};

const unrenderAddPostButton = () => {
  const allRenderedAddPostBtns = document.querySelectorAll(".addpostbtn");
  console.log(allRenderedAddPostBtns);
  for (let i = 0; i < allRenderedAddPostBtns.length; i++) {
    allRenderedAddPostBtns[i].parentNode.removeChild(allRenderedAddPostBtns[i]);
  }
};

const renderAddPostButton = postCommonParent => {
  if (!postCommonParent) return;
  let childrenArray;
  let top;
  let linkToOpenPostInOwnPage;
  childrenArray = Array.from(postCommonParent.childNodes).filter(node =>
    node.hasChildNodes()
  );
  top = childrenArray[0];
  linkToOpenPostInOwnPage = top.querySelector(
    ADDPOST_BTN_SIBLING // the addpost button will be rendered beside this element (on the left).
  );
  const btnEl = document.createElement("span");
  const textNode = document.createTextNode("ADD THIS POST");
  Object.assign(btnEl.style, addPostBtnStyle);
  btnEl.appendChild(textNode);
  btnEl.classList.add("addpostbtn"); // somehow cannot detect the class from content-css.css
  btnEl.onclick = event => {
    getPostData(event);
  };
  linkToOpenPostInOwnPage.parentNode.insertBefore(
    btnEl,
    linkToOpenPostInOwnPage
  );
};

const initFacebookApp = postsContainer => {
  if (!postsContainer) return;
  let posts = null;
  posts = (function() {
    switch (postsContainer.view) {
      case whichFacebookViewEnum.NEWSFEED:
        return postsContainer.el.querySelectorAll(NEWSFEED_POST);
      case whichFacebookViewEnum.PAGE:
        return postsContainer.el.querySelectorAll(PAGEFEED_POST);
      default:
        return null;
    }
  })(postsContainer);
  if (!posts) {
    console.log("Error detecting posts on this pageview.");
    return;
  }
  setupMutationObserver(postsContainer.el, postsContainer.view);
  console.log("Initial number of posts detected: " + posts.length);
  for (let value of posts.values()) {
    console.log(value);
  }
  for (let i = 0; i < posts.length; i++) {
    // for newsfeed pageview: somehow FeedUnit_1 is always empty, not pointing to the second post. Post number 2 onwards starts from index 2.
    if (postsContainer.view === whichFacebookViewEnum.NEWSFEED && i == 1) {
      continue;
    }
    console.log(i);
    let post = posts[i];
    renderAddPostButton(post.querySelector(POST_COMMON_PARENT));
  }
};

const detectPageView = () => {
  // is there any other way of knowing the facebook page view other than querying all the different types?
  let postsContainer = { el: null, view: null }; // for knowing which kind of page to render the addpost btn. E.g the homepage newsfeed
  const newsFeed = document.querySelector(NEWSFEED);
  const pageFeed = document.querySelector(PAGEFEED);
  if (newsFeed) {
    postsContainer.el = newsFeed;
    postsContainer.view = whichFacebookViewEnum.NEWSFEED;
  }
  if (pageFeed) {
    postsContainer.el = pageFeed;
    postsContainer.view = whichFacebookViewEnum.PAGE;
  }
  // Add support for more types of page views such as group / individual post here.
  if (!newsFeed && !pageFeed) {
    console.log("Error detecting facebook page view.");
    return null;
  }
  return postsContainer;
};

// this function should only be called when everything is ready.
function runCrxFb() {
  if (
    document.readyState === "complete" &&
    document.domain === "facebook.com" &&
    appStatusToggle
  ) {
    // For now have to refresh the page after toggling on/off on extension popup
    const postsContainer = detectPageView();
    initFacebookApp(postsContainer);
  }
}

function stopCrxFb() {
  if (document.domain === "facebook.com" && !appStatusToggle) {
    unrenderAddPostButton();
    if (observer) {
      observer.disconnect();
    }
  }
}

// handle case when app is already on and user goes to facebook domain
document.onreadystatechange = function() {
  runCrxFb();
};

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   console.log(request);
//   console.log(sender);
//   if (request.message === "status.complete") {
//     runCrxFb();
//   }
// });
