( () => {

  const {
    ApiRegistry,
    CommonParams,
    setInRequest,
    getFromRequest,
    addBaseObjectCRUDEndpoints,
    currEndpoint,
    currRoute,
  } = Groundhogg.apiDocs
  const { root: apiRoot } = Groundhogg.api.routes.v4
  const {
    sprintf,
    __,
    _x,
    _n,
  } = wp.i18n

  const {
    Fragment,
    Pg,
    Input,
    Textarea,
    InputRepeater,
  } = MakeEl

  ApiRegistry.add('activity', {
    name       : __('Activity'),
    description: () => Fragment([
      Pg({}, __('Add or read contact activity.', 'groundhogg')),
    ]),
    endpoints  : Groundhogg.createRegistry(),
  })

  addBaseObjectCRUDEndpoints(ApiRegistry.activity.endpoints, {
    plural           : __('activities'),
    singular         : __('activity'),
    route            : `${ apiRoot }/activity`,
    searchableColumns: [],
    orderByColumns   : [
      'ID',
      'timestamp',
      'activity_type',
      'contact_id',
      'value',
      'funnel_id',
      'email_id',
      'step_id',
      'event_id',
    ],
    exampleItem      : {
      ID  : 1234,
      data: {
        timestamp    : 1,
        activity_type: 'purchased_product',
        contact_id   : 123,
        funnel_id    : 2,
        step_id      : 4,
        email_id     : 11,
        event_id     : 12345,
        value        : 99.99,
        referer      : 'https://example.com/foo/bar',
        referer_hash : 'abcdefg12345',
      },
      meta: {
        product_name: 'Shirt',
        quantity    : 4,
      },
    },
    createExample    : {
      data: {
        activity_type: 'purchased_product',
        contact_id   : 123,
        value        : 99.99,
      },
      meta: {
        product_name: 'Shirt',
        quantity    : 4,
      },
    },
    updateExample    : {
      data: {
        value        : 109.99,
      },
      meta: {
        product_name: 'Shirt XL',
      },
    },
    readParams       : [
      {
        param      : 'activity_type',
        type       : 'string',
        description: __('Fetch activity of a specific type.', 'groundhogg'),
      },
      {
        param      : 'contact_id',
        type       : 'int',
        description: __('Fetch activity related to a specific contact.', 'groundhogg'),
      },
      {
        param      : 'funnel_id',
        type       : 'int',
        description: __('Fetch activity related to a specific funnel.', 'groundhogg'),
      },
      {
        param      : 'step_id',
        type       : 'int',
        description: __('Fetch activity related to a specific step.', 'groundhogg'),
      },
      {
        param      : 'email_id',
        type       : 'int',
        description: __('Fetch activity related to a specific email.', 'groundhogg'),
      },
      {
        param      : 'after',
        type       : 'string',
        control    : ({
          param,
          name,
          id,
        }) => Input({
          type     : 'date',
          name,
          id,
          value    : getFromRequest(param, '').split(' ')[0],
          className: 'code',
          onInput  : e => setInRequest(param, `${ e.target.value } 00:00:00`),
        }),
        description: () => Pg({}, __('The beginning of the desired date range. Accepts MySQL datetime or UNIX format.', 'groundhogg')),
      },
      {
        param      : 'before',
        type       : 'string',
        control    : ({
          param,
          name,
          id,
        }) => Input({
          type     : 'date',
          name,
          id,
          value    : getFromRequest(param, '').split(' ')[0],
          className: 'code',
          onInput  : e => setInRequest(param, `${ e.target.value } 23:59:59`),
        }),
        description: () => Pg({}, __('The end of the desired date range. Accepts MySQL datetime or UNIX format.', 'groundhogg')),
      },
    ],
    dataParams       : [
      {
        param      : 'activity_type',
        description: __('The type of activity. All lowercase, no spaces or special characters.', 'groundhogg'),
        type       : 'string',
        required   : true,
      },
      {
        param      : 'timestamp',
        description: __('The UNIX timestamp of when the activity occurred. Defaults to the current time.', 'groundhogg'),
        type       : 'int',
      },
      {
        param      : 'value',
        description: __('A value to assign to the activity. Up to 2 decimals are supported.', 'groundhogg'),
        type       : 'float',
        control    : ({
          param,
          id,
          name,
        }) => Input({
          id,
          name,
          type   : 'number',
          step   : 0.01,
          value  : getFromRequest(param),
          onInput: e => {
            setInRequest(param, e.target.value)
          },
        }),
      },
      {
        param      : 'contact_id',
        description: __('The ID of the contact related to the activity.', 'groundhogg'),
        type       : 'int',
        required   : true,
      },
      {
        param      : 'funnel_id',
        description: __('The ID of the funnel related to the activity.', 'groundhogg'),
        type       : 'int',
      },
      {
        param      : 'step_id',
        description: __('The ID of the funnel step related to the activity.', 'groundhogg'),
        type       : 'int',
      },
      {
        param      : 'email_id',
        description: __('The ID of the email related to the activity.', 'groundhogg'),
        type       : 'int',
      },
    ],
  })

} )()
