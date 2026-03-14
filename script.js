const titleInput = document.getElementById("titleInput");
const contentInput = document.getElementById("contentInput");
const addButton = document.getElementById("addButton");
const clearAllButton = document.getElementById("clearAllButton");
const memoList = document.getElementById("memoList");
const statusText = document.getElementById("statusText");
const emptyMessage = document.getElementById("emptyMessage");

let prayerMemos = [];

function saveMemos() {
  localStorage.setItem("prayerMemos", JSON.stringify(prayerMemos));
}

function loadMemos() {
  const saved = localStorage.getItem("prayerMemos");

  if (saved) {
    prayerMemos = JSON.parse(saved);
  } else {
    prayerMemos = [];
  }
}

function updateStatus() {
  const total = prayerMemos.length;
  const answered = prayerMemos.filter(memo => memo.answered).length;
  statusText.textContent = `전체 ${total}개 / 응답됨 ${answered}개`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("ko-KR");
}

function renderMemos() {
  memoList.innerHTML = "";

  if (prayerMemos.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }

  prayerMemos.forEach((memo, index) => {
    const item = document.createElement("div");
    item.className = "memo-item";

    if (memo.answered) {
      item.classList.add("answered");
    }

    const top = document.createElement("div");
    top.className = "memo-top";

    const leftBox = document.createElement("div");

    const title = document.createElement("h2");
    title.className = "memo-title";
    title.textContent = memo.title;

    leftBox.appendChild(title);

    if (memo.answered) {
      const badge = document.createElement("div");
      badge.className = "answered-badge";
      badge.textContent = "응답됨";
      leftBox.appendChild(badge);
    }

    const date = document.createElement("div");
    date.className = "memo-date";
    date.textContent = formatDate(memo.createdAt);

    top.appendChild(leftBox);
    top.appendChild(date);

    const content = document.createElement("div");
    content.className = "memo-content";
    content.textContent = memo.content;

    const actions = document.createElement("div");
    actions.className = "memo-actions";

    const answerButton = document.createElement("button");
    answerButton.className = "answer-btn";
    answerButton.textContent = memo.answered ? "응답 해제" : "응답됨 표시";

    answerButton.addEventListener("click", function () {
      prayerMemos[index].answered = !prayerMemos[index].answered;
      saveMemos();
      renderMemos();
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "삭제";

    deleteButton.addEventListener("click", function () {
      const ok = confirm("이 기도제목을 삭제하시겠습니까?");
      if (!ok) return;

      prayerMemos.splice(index, 1);
      saveMemos();
      renderMemos();
    });

    actions.appendChild(answerButton);
    actions.appendChild(deleteButton);

    item.appendChild(top);
    item.appendChild(content);
    item.appendChild(actions);

    memoList.appendChild(item);
  });

  updateStatus();
}

function addMemo() {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (title === "") {
    alert("제목을 입력해 주세요.");
    titleInput.focus();
    return;
  }

  if (content === "") {
    alert("내용을 입력해 주세요.");
    contentInput.focus();
    return;
  }

  const newMemo = {
    title: title,
    content: content,
    answered: false,
    createdAt: new Date().toISOString()
  };

  prayerMemos.unshift(newMemo);

  titleInput.value = "";
  contentInput.value = "";
  titleInput.focus();

  saveMemos();
  renderMemos();
}

function clearAllMemos() {
  if (prayerMemos.length === 0) {
    alert("삭제할 기도제목이 없습니다.");
    return;
  }

  const ok = confirm("정말 전체 삭제하시겠습니까?");
  if (!ok) return;

  prayerMemos = [];
  saveMemos();
  renderMemos();
}

addButton.addEventListener("click", addMemo);
clearAllButton.addEventListener("click", clearAllMemos);

titleInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addMemo();
  }
});

loadMemos();
renderMemos();
