// Animated Neural Network / AI Lines Background
(function() {
  const colors = ['#00fff7', '#a259ff', '#00ff99'];
  const nodeCount = 32;
  const nodes = [];
  const maxDist = 180;
  let canvas, ctx, w, h, dpr;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  function randomNode() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: 2 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }

  function updateNodes() {
    for (let node of nodes) {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > w) node.vx *= -1;
      if (node.y < 0 || node.y > h) node.vy *= -1;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    // Draw lines
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i], n2 = nodes[j];
        const dx = n1.x - n2.x, dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = 0.18 * (1 - dist / maxDist);
          ctx.strokeStyle = n1.color;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    // Draw nodes
    for (let node of nodes) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function animate() {
    updateNodes();
    draw();
    requestAnimationFrame(animate);
  }

  function init() {
    canvas = document.createElement('canvas');
    canvas.id = 'cyber-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = 1;
    document.getElementById('cyber-bg').appendChild(canvas);
    ctx = canvas.getContext('2d');
    resize();
    nodes.length = 0;
    for (let i = 0; i < nodeCount; i++) nodes.push(randomNode());
    window.addEventListener('resize', resize);
    animate();
  }

  window.addEventListener('DOMContentLoaded', init);
})(); 