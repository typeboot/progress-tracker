import express from "express";
import appService from "../dataservice";

const routerInstance = (router: express.Router) => {

    router.get("/apps", async (req, res) => {
        const result = await appService.getApps();
        res.status(result.status).json(result.data);
    });


    router.get("/apps/:app/runs", async (req, res) => {
        const appName = req.params.app;
        const result = await appService.getRuns(appName);
        res.status(result.status).json(result.data);
    });

    router.get("/apps/:app/migrations", async (req, res) => {
        const appName = req.params.app;
        const result = await appService.getMigrations(appName);
        res.status(result.status).json(result.data);
    });

    router.get("/health", async (req, res) => {
        const result = await appService.health();
        res.status(result.code).json({status: result.data.status, message: result.data.message});
    });
    return router;
};

export default routerInstance;
