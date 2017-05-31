export default function a () {
    var zz = [1, 2, 3];

    zz.forEach((item,index) => {
        console.log(item, index);
    });

    console.log('console from b!');

    var m = 'hello, world';

    console.log(`杨文杰，${m}`);

    const zzz = [4, ...zz];
    
    console.log(zzz)
}
