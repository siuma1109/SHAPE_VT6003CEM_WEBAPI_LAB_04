import Router, { RouterContext } from "koa-router";

const router: Router = new Router();

/** index */
router.get('/', async (ctx: RouterContext, next: any) => {
    ctx.body = { msg: 'Hello world!' };
    await next();
})

router.post('/', async (ctx: RouterContext, next: any) => {
    const data = ctx.request.body;
    ctx.body = data;
    await next();
});

export default router;