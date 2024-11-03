/**
 * QUERY KEY 관리
 * QUERY_KEYS.[API_URL_BASE_IDENTIFIER].[API_ENDPOINT_IDENTIFIER]: [string | function]
 */

const QUERY_KEYS = {
  YES_NO: {
    API: ['api'],
  },
  ORDERS: {
    /* 정적 parameter 에 대한 쿼리키 관리 */
    ALL: ['orders'],
    /* 가변 parameter 에 대한 쿼리 키 대응 */
    DETAILS: (id: string) => ['order', id],
  },
  ADMIN: {
    TODO: ['todo'],
  },
};

export { QUERY_KEYS };
