const pluginName = 'minigql-plugin-miniserver';

type ServiceItem = {
  name: string;
  url: string;
  methods: string[];
};

type Services = { [k: string]: Omit<ServiceItem, 'name'> };

const createServices = (s: null | ServiceItem[]) => {
  if (!s) {
    return null;
  }

  const fetcher = async (name: string, url: string, input: any) => {
    const res = await fetch(`${url}/service`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serviceMethod: name,
        input,
      }),
    });

    return res.json();
  };

  return s.reduce(
    (prev, current) => ({
      ...prev,
      [current.name]: current.methods.reduce(
        (p, c) => ({
          ...p,
          [c]: (input?: any) => fetcher(c, current.url, input),
        }),
        {},
      ),
    }),
    {},
  );
};

const getServices = (services: Services) => {
  if (!services) {
    return null;
  }
  const servicesData = Object.entries(services).reduce(
    (prev, current: [string, any]) =>
      prev.concat({
        name: current[0],
        url: current[1].url,
        methods: current[1].methods,
      }),
    [] as ServiceItem[],
  );

  return servicesData;
};

export default function (services: Services) {
  const servicesData = createServices(getServices(services));
  const resolverParam = { services: servicesData };

  return { resolverParam, name: pluginName };
}
