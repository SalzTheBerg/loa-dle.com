window.addEventListener("load", () => {
  if (!localStorage.getItem("noticeShown")) {
    document.getElementById("notice").style.display = "flex";
  }
});

function closeNotice() {
  document.getElementById("notice").style.display = "none";
  localStorage.setItem("noticeShown", "true");
  document.getElementById("info").click();
}