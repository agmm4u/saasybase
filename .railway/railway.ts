import { defineRailway, github, postgres, project, redis, service, volume } from "railway/iac";

export default defineRailway(() => {
  const Redis = redis("Redis", { region: "iad" });
  Redis.deploy = { multiRegionConfig: { iad: { numReplicas: 1 } }, startCommand: "/bin/sh -c \"rm -rf $RAILWAY_VOLUME_MOUNT_PATH/lost+found/ && exec docker-entrypoint.sh redis-server --requirepass $REDIS_PASSWORD --save 60 1 --dir $RAILWAY_VOLUME_MOUNT_PATH\"" };
  Redis.networking = { privateNetworkEndpoint: "redis" };
  const Postgres = postgres("Postgres", { region: "iad" });
  Postgres.deploy = { multiRegionConfig: { iad: { numReplicas: 1 } } };
  Postgres.networking = { privateNetworkEndpoint: "postgres" };
  const redisVolume = volume("redis-volume", { alerts: { usage: { "100": {}, "80": {}, "95": {} } }, allowOnlineResize: true, region: "iad", sizeMB: 500 });
  const postgresVolume = volume("postgres-volume", { alerts: { usage: { "100": {}, "80": {}, "95": {} } }, allowOnlineResize: true, region: "iad", sizeMB: 500 });
  const saasybase = service("saasybase", {
    source: github("agmm4u/saasybase", { branch: "main", checkSuites: false }),
    build: { buildEnvironment: "V3", builder: "RAILPACK" },
    preDeploy: "npm run prisma:deploy",
    replicas: { "iad": 1 },
    domains: ["ibangkok.ai"],
  });

  return project("responsible-quietude", {
    variables: { managed: false },
    resources: [Redis, saasybase, Postgres, redisVolume, postgresVolume],
  });
});
