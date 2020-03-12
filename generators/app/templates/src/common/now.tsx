import ajax from 'packing-ajax';

ajax({
  url: '/api/now',
  success: (data: any) => {
    console.log(`🕑 --> ${data.now}`);
  }
});
