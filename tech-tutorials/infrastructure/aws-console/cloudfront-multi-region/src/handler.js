/* eslint-disable no-console */
export const handler = async (event) => {
  const request = event.Records[0].cf.request;
  const headers = request.headers;

  const country = headers['cloudfront-viewer-country']
    ? headers['cloudfront-viewer-country'][0].value
    : 'UNKNOWN';

  console.log('Lambda@Edge triggered');
  console.log('Country:', country);

  // Set origin based on country
  let originDomain = '';
  if (country === 'GB') {
    originDomain = 'grit-coding-london.s3-website.eu-west-2.amazonaws.com';
  } else if (country === 'KR') {
    originDomain = 'grit-coding-seoul.s3-website.ap-northeast-2.amazonaws.com';
  } else {
    // Default to London if unknown
    originDomain = 'grit-coding-london.s3-website.eu-west-2.amazonaws.com';
  }

  // Update the origin object
  request.origin = {
    custom: {
      domainName: originDomain,
      port: 80,
      protocol: 'http',
      path: '',
      sslProtocols: ['TLSv1', 'TLSv1.1', 'TLSv1.2'],
      readTimeout: 30,
      keepaliveTimeout: 5,
      customHeaders: {},
    },
  };

  // Also update the host header
  request.headers['host'] = [{ key: 'host', value: originDomain }];

  console.log('Updated origin:', JSON.stringify(request.origin));

  return request;
};
