const isWhichBodyPart = childOfMiddle => {
  if (childOfMiddle.hasAttributes()) {
    const id = childOfMiddle.getAttribute("id");
    const classesInNode = childOfMiddle.classList;
    const dir = childOfMiddle.getAttribute("dir");
    const tagName = childOfMiddle.tagName;
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

const digestBodyText = textChild => {
  return textChild.textContent;
};

const digestBodyBlockQuote = blockQuoteChild => {
  return blockQuoteChild.querySelector(SELECTOR_TO_POST_BODY_BLOCK_QUOTE)
    .textContent;
};

const digestBodyOtherFbPost = otherFbPostChild => {
  return otherFbPostChild
    .querySelector(SELECTOR_TO_POST_BODY_OTHER_FB_POST_LINK)
    .getAttribute("href");
};

const digestBodyOwnContent = ownContentChild => {
  const ext_link = ownContentChild.querySelector(
    SELECTOR_TO_POST_BODY_OWN_CONTENT_EXT_LINK
  );
  const video = ownContentChild.querySelector(
    SELECTOR_TO_POST_BODY_OWN_CONTENT_VIDEO
  );
  if (ext_link) {
    return ext_link.getAttribute("href");
  } else if (video) {
    return "Content is a video.";
  } else {
    return "Unknown own content.";
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
      let reactions = {};
      const individualCommentCommonParent = listOfReplies[i].querySelector(
        SELECTOR_TO_INDIVIDUAL_COMMENT_COMMON_PARENT
      );
      console.log(individualCommentCommonParent);
      if (individualCommentCommonParent) {
        const commentorNode = individualCommentCommonParent.querySelector(
          SELECTOR_TO_COMMENT_COMMENTOR
        );
        const saidNode = individualCommentCommonParent.querySelector(
          SELECTOR_TO_COMMENT_SAID
        );
        const attachedToCommentNode = listOfReplies[i].querySelector(
          SELECTOR_TO_COMMENT_ATTACHED
        );
        console.log(attachedToCommentNode);
        if (attachedToCommentNode) {
          const img = attachedToCommentNode.querySelector(
            SELECTOR_TO_COMMENT_ATTACHED_IMG
          );
          const ext_link = attachedToCommentNode.querySelector(
            SELECTOR_TO_COMMENT_ATTACHED_EXT_LINK
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
        SELECTOR_TO_GETALLREPLIES_MORE_REPLIES
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

const getPostData = event => {
  let top, middle, bottom;
  let author = { name: "", fbLink: "" };
  let comments = [];
  let postBody = {};
  // const view = parseInt(event.target.getAttribute("view")); // unused for now
  const postCommonParent = event.target.closest(SELECTOR_TO_POST_COMMON_PARENT);
  console.log(postCommonParent);
  if (postCommonParent) {
    const childrenArray = Array.from(postCommonParent.childNodes).filter(
      node => node.hasChildNodes() && node.classList.length === 0 // filterning classList.length === 0 is to remove advertisements.
    ); // childrenArray consists of the header (top), body (middle) and footer (bottom) of a post.
    top = childrenArray[0];
    middle = childrenArray[1];
    bottom = childrenArray[2];
    const authorNode = top.querySelector(SELECTOR_TO_POST_AUTHOR);
    if (authorNode) {
      author.name = authorNode.textContent || `unable to get author's name`;
      author.fbLink = authorNode.getAttribute("href");
    }
    for (let p = 0; p < middle.children.length; p++) {
      const bodyPart = isWhichBodyPart(middle.children[p]);
      switch (bodyPart) {
        case postBodyPartEnum.TEXT:
          console.log("text");
          postBody["text"] = digestBodyText(middle.children[p]);
          break;
        case postBodyPartEnum.BLOCKQUOTE:
          console.log("blockquote");
          postBody["blockQuote"] = digestBodyBlockQuote(middle.children[p]);
          break;
        case postBodyPartEnum.OTHER_FB_POST:
          console.log("other fb post");
          postBody["otherFbPost"] = digestBodyOtherFbPost(middle.children[p]);
          break;
        case postBodyPartEnum.OWN_CONTENT:
          console.log("own content");
          postBody["ownContent"] = digestBodyOwnContent(middle.children[p]);
          break;
        case postBodyPartEnum.UNKNOWN:
          console.log("unknown body part");
          break;
        default:
          console.log("switch statement which body part not working");
      }
    }
    console.log(postBody);
    const commentsSection = bottom.querySelector(SELECTOR_TO_COMMENTS_SECTION);
    console.log(commentsSection); // an unordered list
    if (commentsSection) {
      comments = getAllReplies(commentsSection.children);
    } else {
      console.log("cant find commentsSection.");
    }
  } else {
    console.log("cant find postCommonParent.");
  }
  sendPostToCrx(author, postBody, comments);
};

const sendPostToCrx = (author, postBody, comments) => {
  let parcel = {
    message: "new.fb.post.added",
    content: {
      author,
      postBody,
      comments
    }
  };
  chrome.runtime.sendMessage(parcel, res => {
    console.log(res);
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
                        mutation.addedNodes[i].querySelector(
                          SELECTOR_TO_POST_COMMON_PARENT
                        ),
                        view
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
                      mutation.addedNodes[i].querySelector(
                        SELECTOR_TO_POST_COMMON_PARENT
                      ),
                      view
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
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
  // observer.disconnect();
};

const renderAddPostButton = (postCommonParent, view) => {
  if (!postCommonParent) return;
  let top;
  let childrenArray = Array.from(postCommonParent.childNodes).filter(node =>
    node.hasChildNodes()
  );
  top = childrenArray[0];
  let linkToOpenPostInOwnPage = top.querySelector(
    SELECTOR_TO_ADDPOST_BTN_SIBLING // the addpost button will be rendered beside this element (on the left).
  );
  const btnEl = document.createElement("span");
  const textNode = document.createTextNode("ADD THIS POST");
  Object.assign(btnEl.style, addPostBtnStyle);
  btnEl.setAttribute("view", view);
  // btnEl.classList.add("btnEl"); somehow cannot detect the class from content-css.css
  btnEl.appendChild(textNode);
  btnEl.onclick = event => {
    getPostData(event);
  };
  linkToOpenPostInOwnPage.parentNode.insertBefore(
    btnEl,
    linkToOpenPostInOwnPage
  );
};

const initFacebookApp = () => {
  {
    let postsContainer = { el: null, view: null }; // for knowing which kind of page to render the addpost btn. E.g the homepage newsfeed
    let posts = null;
    const newsFeed = document.querySelector(SELECTOR_TO_NEWSFEED);
    const pageFeed = document.querySelector(SELECTOR_TO_PAGEFEED);
    if (newsFeed) {
      postsContainer.el = newsFeed;
      postsContainer.view = whichFacebookViewEnum.NEWSFEED;
    }
    if (pageFeed) {
      postsContainer.el = pageFeed;
      postsContainer.view = whichFacebookViewEnum.PAGE;
    }
    if (!newsFeed && !pageFeed) {
      console.log("unable to get newsfeed or page data.");
      return;
    }
    setupMutationObserver(postsContainer.el, postsContainer.view);
    // can find other ways to check which facebook view is it? can make the code more reusable if can find a way to check and pass in as params to this function.
    if (postsContainer.view === whichFacebookViewEnum.NEWSFEED) {
      posts = newsFeed.querySelectorAll(SELECTOR_TO_NEWSFEED_POST);
    }
    if (postsContainer.view === whichFacebookViewEnum.PAGE) {
      posts = pageFeed.querySelectorAll(SELECTOR_TO_PAGEFEED_POST);
      // posts = pageFeed.querySelectorAll("div.lzcic4wl[role='article']"); // can do this also but make it same as the detected childNodes in mutation observer to make it more standardized.
    }
    if (!posts) {
      console.log("unable to get posts.");
      return;
    }
    console.log("number of posts: " + posts.length);
    for (let value of posts.values()) {
      console.log(value);
    }
    for (let i = 0; i < posts.length; i++) {
      // somehow FeedUnit_1 is always empty, not pointing to the second post. Post number 2 onwards starts from index 2.
      // this is only for newsfeed.
      if (i == 1 && postsContainer.view === whichFacebookViewEnum.NEWSFEED) {
        continue;
      }
      console.log(i);
      let post = posts[i];
      renderAddPostButton(
        post.querySelector(SELECTOR_TO_POST_COMMON_PARENT),
        postsContainer.view
      );
    }
  }
};

document.onreadystatechange = function() {
  if (
    document.readyState === "complete" &&
    document.domain === "facebook.com" &&
    appStatusToggle
  ) {
    // For now have to refresh the page after toggling on/off on extension popup
    initFacebookApp();
  }
};
