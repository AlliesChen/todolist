const storage = {
  usage: (localStorage.length) ? JSON.parse(localStorage.getItem('TODOList')) : {},
  get check() {
    return this.usage;
  },
  set check(item) {
    const local = Object.assign(this.usage, item);
    localStorage.setItem('TODOList', JSON.stringify(local));
  },
};

export default storage;
