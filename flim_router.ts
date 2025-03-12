import { body, CustomErrorMessageFunction, CustomValidatorFunction, validationResults } from "koa-req-validation";
import Router, { RouterContext } from "koa-router";

/** flim */
interface Flim {
    id: number;
    [key: string]: any; // Allow additional properties
}
let flims: Flim[] = [
    { id: 1, title: 'title 1', description: 'description 1' },
    { id: 2, title: 'title 2', description: 'description 2' },
    { id: 3, title: 'title 3', description: 'description 3' },
];

const flimRouter: Router = new Router();
flimRouter.prefix('/flims');
flimRouter.get('/', async (ctx: RouterContext, next: any) => {
    ctx.body = flims;
    await next();
});


const customErrorMessage: CustomErrorMessageFunction = (
    _ctx: RouterContext,
    value: string
) => {
    return (
        `The title must be between 3 and 20 ` +
        `characters long but received length ${value.length}`
    );
};

const insertFlimValidator = [
    body("title").isLength({ min: 3 }).withMessage(customErrorMessage).build()
];

interface insertFlimRequestBody {
    title: string;
    description: string;
}

flimRouter.post('/', ...insertFlimValidator, async (ctx: RouterContext, next: any) => {

    const validationResult = validationResults(ctx);
    if (validationResult.hasErrors()) {
        ctx.status = 422;
        ctx.body = { err: validationResult.mapped() }
        await next();
        return;
    }

    const body = ctx.request.body as insertFlimRequestBody;

    flims.push(
        {
            id: flims.length + 1,
            title: body.title,
            description: body.description
        }
    );
    ctx.body = flims;
    await next();
});

const customIdCheckingValidator: CustomValidatorFunction = async (input: unknown): Promise<void> => {
    const target = flims.find(flim => flim.id == input);
    if (!target) {
        throw customIdErrorMessage;
    }
};

const customIdErrorMessage: CustomErrorMessageFunction = (
    _ctx: RouterContext,
    value: String
) => {
    return (
        `The id of ${value} is not exists`
    );
};

const updateFlimValidator = [
    body("id").custom(customIdCheckingValidator).withMessage(customIdErrorMessage).build(),
    body("title").isLength({ min: 3 }).withMessage(customErrorMessage).build()
];

interface updateFlimRequestBody {
    id: number;
    title: string;
    description: string;
}

flimRouter.put('/', ...updateFlimValidator, async (ctx: RouterContext, next: any) => {
    const validationResult = validationResults(ctx);
    if (validationResult.hasErrors()) {
        ctx.status = 422;
        ctx.body = { err: validationResult.mapped() }
        await next();
        return;
    }

    const onChange = (props: string, value: string, id: Number) => {
        const obj = flims.find(x => x.id === id);
        if (obj) {
            obj[props] = value;
        }
    }

    const body = ctx.request.body as updateFlimRequestBody;

    onChange("title", body.title, body.id);
    onChange("description", body.description, body.id);

    ctx.body = flims;
    await next();
});

export default flimRouter;