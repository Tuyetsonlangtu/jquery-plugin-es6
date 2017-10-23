import './message-box.scss';

class MessageBox {
  constructor() {
    this.open();
  }

  open() {
    setTimeout(() => {
      $("#isolt-dlg").addClass('isolt-dlg-open');
    }, 2000);

    // setTimeout(() => {
    //   $("#isolt-dlg").removeClass('isolt-dlg-open');
    //   console.log("open message box");
    // }, 6000);
  }
}
const messageBox = new MessageBox();
export default messageBox