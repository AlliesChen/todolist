const popUp = document.getElementById("popUp");

function showMsgPopUp(msg, useInput, err) {
  popUp.classList.remove("dp-none");
  popUp.querySelector("label").textContent = msg;
  if (useInput) {
    popUp.querySelector("input").classList.remove("dp-none");
  } else {
    popUp.querySelector("input").classList.add("dp-none");
  }
  if (err) {
    if (popUp.querySelector("[data-err]")) {
      const childNode = popUp.querySelector("[data-err]");
      popUp.querySelector("[data-form]").removeChild(childNode);
    }
    const hint = document.createElement("p");
    hint.textContent = err;
    hint.dataset.err = true;
    popUp
      .querySelector("[data-form]")
      .insertBefore(hint, popUp.querySelector("[data-buttons]"));
  }
  return 0;
}

const event = {
  use: "function",
  input: "string",
  /**
   * @param {function} callback
   */
  set fn(callback) {
    this.use = callback;
  },
  /**
   * @param {string} val
   */
  set inputVal(val) {
    this.input = val;
  },
};

popUp.addEventListener("click", (e) => {
  if (popUp.querySelector("[data-err]")) {
    const childNode = popUp.querySelector("[data-err]");
    popUp.querySelector("[data-form]").removeChild(childNode);
  }
  if (e.target.matches("#popUp") || e.target.matches(".warning")) {
    e.preventDefault();
    popUp.classList.add("dp-none");
    popUp.querySelector("input").value = "";
  }
  if (e.target.matches(".success")) {
    e.preventDefault();
    if (popUp.querySelector("input").classList.contains("dp-none")) {
      event.use();
      popUp.classList.add("dp-none");
    } else {
      event.inputVal = popUp.querySelector("input").value ?? false;
      popUp.querySelector("input").value = "";
      event.use(event.input);
      popUp.classList.add("dp-none");
    }
  }
});

export { showMsgPopUp, event };
