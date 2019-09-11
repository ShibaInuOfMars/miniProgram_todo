// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],

    title: '',

    index: 0,

    leftCount: 0
  },

  onShow() {
    // 页面一显示就从本地加载任务列表
    this.data.list = wx.getStorageSync('todos') || [];

    this.data.index = this.data.list.length > 0 ? this.data.list[this.data.list.length - 1].id : 0;

    // 同步数据
    this.setData(this.data);

    // 页面一显示就计算未完成的任务个数
    this.leftCount();
  },

  // 删除一条记录
  delOne(e) {
    // 1. 获取需要删除的记录的id
    // console.log(e.currentTarget.dataset);
    let id = e.currentTarget.dataset.id;

    // 2. 通过id获取到该条记录在数组中的索引
    let idx = this.data.list.findIndex(item => item.id === id);

    // 3. 通过索引将该条记录从数组中移除
    this.data.list.splice(idx, 1);

    // 4. 重点：同步数据
    this.setData(this.data);

    // 统计未完成的任务的个数
    this.leftCount();

    this.save();
  },

  // 切换任务的完成状态
  changeState(e) {
    // 1. 获取需要修改状态的记录的id
    let id = e.currentTarget.dataset.id;

    // 2. 通过id获取到该条记录在数组中的索引
    let idx = this.data.list.findIndex(item => item.id === id);

    // 3. 将对应的任务的完成状态取反
    this.data.list[idx].completed = !this.data.list[idx].completed;

    // 4. 重点：同步数据
    this.setData(this.data);

    // 统计未完成的任务的个数
    this.leftCount();

    this.save();
  },

  // 实现文本框的双向数据绑定
  getTitle(e) {
    // 1. 获得文本框输入的值
    // console.log(e.detail);
    let val = e.detail.value;

    // 2. 将该值赋值给data中的title
    this.data.title = val;

    // 3. 重点：同步数据
    this.setData(this.data);
  },

  // 添加一条任务
  addOne() {
    // 1. 判断标题是否为空
    if (!this.data.title.trim()) {
      this.data.title = '';
      this.setData(this.data);
      return;
    }

    // 2. 创建一个任务对象
    let obj = {
      id: ++this.data.index,
      title: this.data.title,
      completed: false
    };

    // 3. 将这个任务添加到任务数组
    this.data.list.push(obj);

    // 4. 清空文本框
    this.data.title = '';

    // 5. 重点：同步数据
    this.setData(this.data);

    // 统计未完成的任务的个数
    this.leftCount();

    this.save();
  },

  // 清除已完成的任务
  clearCompleted() {
    // 1. 通过数组的filter方法将completed为true的过滤出来
    this.data.list = this.data.list.filter(item => !item.completed);

    // 2. 重点：同步数据
    this.setData(this.data);

    // 统计未完成的任务的个数
    this.leftCount();

    this.save();
  },

  // 切换所有任务的完成状态
  toggleAll1() {
    // 1. 判断所有任务中，是否全部的completed都为true，如果是则将所有任务的completed改为false
    let flag = this.data.list.every(item => item.completed);

    // 2. 改变所有任务的完成状态
    this.data.list.forEach(item => item.completed = !flag);

    // 3. 重点：同步数据
    this.setData(this.data);

    // 统计未完成的任务的个数
    this.leftCount();

    this.save();
  },

  // 切换所有任务的完成状态方式二
  toggleAll2() {
    // 1. 判断所有任务中，是否至少有一个completed为false，如果是则将所有任务的completed改为true
    let flag = this.data.list.some(item => !item.completed);

    // 2. 改变所有任务的完成状态
    this.data.list.forEach(item => item.completed = flag);

    // 3. 重点：同步数据
    this.setData(this.data);

    // 统计未完成的任务的个数
    this.leftCount();

    this.save();
  },

  // 统计未完成的任务的个数
  leftCount() {
    this.data.leftCount = this.data.list.filter(item => !item.completed).length;

    // 重点：同步数据
    this.setData(this.data);
  },

  // 实现数据持久化
  save() {
    // 微信小程序中setStorage是可以存储对象的
    wx.setStorageSync('todos', this.data.list);
  }
})