import Koa from "koa";
import { RouterContext } from "koa-router";
import logger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";
import indexRouter from "./router"
import flimRouter from "./flim_router";

const app: Koa = new Koa();

app.use(json());
app.use(logger());
app.use(bodyParser());
app.use(indexRouter.routes()).use(indexRouter.allowedMethods());
app.use(flimRouter.routes()).use(flimRouter.allowedMethods());

app.use(async (ctx: RouterContext, next: any) => {
    try {
        await next();
        if (ctx.status === 404) {
            ctx.status = 404;
            ctx.body = { err: "No such endpoint existed" };
        }
    } catch (err: any) {
        ctx.body = { err: err };
    }
})

app.listen(10888, () => {
    console.log("Koa Started");
})