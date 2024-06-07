const Koa = require('koa');
const app = new Koa();

async function someFunction(ctx, next) {
  return new Promise(resolve => {
    setTimeout(resolve, Math.random() * 1000);
  });
}

app.use(async (ctx, next) => {
  // start a timer
  const start = Date.now();
  ctx.state.start = start;
  console.log('Started a timer.');
  await next();
  const ms = Date.now() - start;
  console.log(`Ended the accurate timer. Time: ${ms}ms`);
});

app.use(async (ctx, next) => {
  await next();
  await someFunction(ctx, next);
});

app.use(async (ctx, next) => {
  await next();
  const ms = Date.now() - ctx.state.start;
  console.log(`Ended the unreliable timer: ${ms}ms`);
});

app.use(async ctx => {
  await new Promise(resolve => {
    setTimeout(resolve, Math.random() * 1000);
  });
  ctx.body = 'Hello World';
});


app.listen(3000);
