export const useScrollX = () => {
  const bindEle = () => {
    // 获取页面元素
    const container = document.querySelector('.task-board');
    let isDown = false;
    let startX;
    let scrollLeft;

    // 监听鼠标左键按下事件
    container?.addEventListener('mousedown', (e) => {
      console.log(`output->mousedown`, 'mousedown');
      isDown = true;
      container.classList.add('active');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      document?.addEventListener('mousemove', funMouseMove);

      container?.addEventListener('mouseup', funMouseUp);
    });
    const funMouseUp = () => {
      isDown = false;
      container.classList.remove('active');
      document.removeEventListener('mouseup', funMouseUp);
      container.removeEventListener('mousemove', funMouseMove);
    };
    const funMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1; // 定义移动距离的倍数，可以调整滚动速度
      container.scrollLeft = scrollLeft - walk;
    };
    // taskBoard?.addEventListener('mousedown', (e) => {
    //   console.log(`output->mousedown`, e.target);
    //   e.stopPropagation();
    // });
    // 监听鼠标左键抬起事件
    // container?.addEventListener('mouseup', funMouseUp);

    // // 监听鼠标移动事件
    // container?.addEventListener('mousemove', funMouseMove);
  };
  return {
    bindEle,
  };
};
