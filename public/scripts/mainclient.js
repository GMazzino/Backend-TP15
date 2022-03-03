const socket = io();

document
  .querySelector("#frmNewProduct")
  .addEventListener("submit", async (e) => {
    if (e.cancelable) {
      e.preventDefault();
      await fetch("./api/products", {
        method: "POST",
        body: JSON.stringify({
          title: document.querySelector("#frmNewProduct input[name=title]")
            .value,
          price: document.querySelector("#frmNewProduct input[name=price]")
            .value,
          thumbnail: document.querySelector(
            "#frmNewProduct input[name=thumbnail]"
          ).value,
        }),
        headers: { "Content-Type": "application/json" },
      });
    }
  });

socket.on("renderProducts", async (products) => {
  renderProducts(products);
});

async function renderProducts(products) {
  const hbsTpl = await (
    await fetch("../hbs/templates/productsgrid.hbs")
  ).text();
  const hbsTplProductsGrid = Handlebars.compile(hbsTpl);
  document.querySelector("#productsGrid").innerHTML = hbsTplProductsGrid({
    products: products,
  });
}

document.querySelector("#frmChat").addEventListener("submit", (e) => {
  if (e.cancelable) {
    e.preventDefault();
    if (document.querySelector("#frmChat input[name='email'").value != "") {
      const chatMsg = {
        email: document.querySelector("#frmChat input[name='email'").value,
        datetime: "",
        msg: document.querySelector("#frmChat input[name='msg'").value,
      };
      document.querySelector("#frmChat input[name='msg'").value = "";
      socket.emit("chatMsg", JSON.stringify(chatMsg));
    }
  }
});

socket.on("newChatMsg", async (chatMsgs) => {
  renderChatMsg(JSON.parse(chatMsgs));
});

async function renderChatMsg(chatMsgs) {
  const hbsTpl = await (await fetch("../hbs/templates/chatmsg.hbs")).text();
  const hbsTplChatMsg = Handlebars.compile(hbsTpl);
  document.querySelector("#chatMsgs").innerHTML = hbsTplChatMsg({
    chatMsg: chatMsgs,
  });
}
