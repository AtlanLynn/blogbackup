---
title: ViewPager页面管理策略
date: 2016-09-14 15:21:55
comments: true
tags:
   - 技术
   - Android
---
在项目中，首页广告自动循环轮播图使用ViewPager加一个线程实现，但是当广告数量是2时，出现了java.lang.IllegalStateException: The specified child already has a parent.异常

<!--more-->
### 初始Adapter代码
```
public class BannerAdapter extends PagerAdapter {
  private Context context;
  private List<String> mDatas;
  private List<TextView> viewList;
  public BannerAdapter(Context context, List<String> mDatas){
      this.mDatas = mDatas;
      this.context = context;
      viewList = new ArrayList<>();
      for(int i=0;i<mDatas.size();i++){
          TextView view = new TextView(context);
          viewList.add(view);
      }
  }
  @Override
  public void destroyItem(ViewGroup container, int position, Object object) {
      TextView testView = viewList.get(position % viewList.size());
      container.removeView(testView);
  }

  @Override
  public Object instantiateItem(ViewGroup container, int position) {
      position = position % mDatas.size();
      if(position < 0){
          position = mDatas.size()+position;
      }
      TextView textView = viewList.get(position);
      textView.setGravity(Gravity.CENTER);
      textView.setBackgroundColor(Color.BLUE);
      ViewGroup.LayoutParams layoutParams = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);

      container.addView(textView, layoutParams);
      textView.setText(mDatas.get(position));
      return textView;
  }

  @Override
  public int getCount() {
      if (mDatas.size() == 1) {
          return 1;
      }else{
          return Integer.MAX_VALUE;
      }
  }

  @Override
  public boolean isViewFromObject(View view, Object object) {
      return view == object;
  }
}
```
为了避免每次都创建新的view，使用了List<TextView> viewList来记录用到的view，以方便复用。viewList的数量和数据源数量一致。

mDatas.size == 2时，出现java.lang.IllegalStateException:The specified child already has a parent. You must call removeView() on the child's parent first.
根据字面意思是一个子View已经存在一个父View，你必须先调用该子视图的父视图的 removeView() 方法，出现这种错误的原因是一个子控件只允许存在一个父控件。

代码是在instantiateItem时将子view添加到ViewGroup container上，在destroyItem时再removeView()掉，为什么会只在mDatas.size == 2时候没有调用removeView()呢？

### 原因分析
通过查看instantiateItem和destroyItem的调用，发现：
* 显示第一个时，viewpager会
 - instantiateItem position 0 ———>viewList.get(0) 添加到页面
 - instantiateItem position 1———>viewList.get(1) 添加到页面


* 显示第二个时，
instantiateItem position 2 ———>viewList.get(0) 添加到页面，此时这个TextView已经被添加过，因此报错

* 显示第三个时才会destroyItem position 0

***
页面管理策略
> ViewPager会缓存当前显示页面的前一页和后一页（默认情况下mOffscreenPageLimit==1），ViewPager管理页面的策略是：先判断页面是否在缓存的范围内，如果不在则Destroy掉（调用PagerAdapter的destroyItem）,而如果在缓存范围，但是这个位置上页面不存在（即没有加入到ViewPager），则调用PagerAdapter的instantiateItem来添加新页面

***

### 修改Adapter代码

在每次添加的时候判断是否有父view，是则removeView()掉
```
@Override
   public void destroyItem(ViewGroup container, int position, Object object) {
       //instantiateItem中已经处理removeView
   }

   @Override
   public Object instantiateItem(ViewGroup container, int position) {
       position = position % mDatas.size();
       if(position < 0){
           position = mDatas.size()+position;
       }
       TextView textView = viewList.get(position);
       textView.setGravity(Gravity.CENTER);
       textView.setBackgroundColor(Color.BLUE);
       ViewGroup.LayoutParams layoutParams = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        ViewParent vp =textView.getParent();
        if (vp!=null){
           ViewGroup parent = (ViewGroup)vp;
           parent.removeView(textView);
       }
       container.addView(textView, layoutParams);
       textView.setText(mDatas.get(position));
       return textView;
   }
```

### ViewPager源码解析
* 参考[ViewPager源码解惑](http://www.jianshu.com/p/85afaf9e8f6e#)
* 参考[ViewPager源码分析（3）与PagerAdapter 交互](http://blog.csdn.net/huachao1001/article/details/51658334)
