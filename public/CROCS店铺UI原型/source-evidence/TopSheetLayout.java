package com.bytedance.android.shopping.store.home.view;

import X.0BGG;
import X.C0MS3;
import X.C0MS4;
import X.C0NHW;
import X.C21770MRw;
import X.C21780MRx;
import X.C23060MWv;
import X.C35630Msw;
import X.C35640Msx;
import Y.ASListenerS209S0100000_13;
import android.content.Context;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.VelocityTracker;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.widget.LinearLayout;
import android.widget.Scroller;
import androidx.recyclerview.widget.RecyclerView;
import com.GlobalProxyLancet;
import com.bytedance.android.ec.hybrid.list.view.ECHybridRecyclerView;
import com.bytedance.android.ec.store.setting.ShopCollapseAnimConfig;
import com.bytedance.android.shopping.store.home.presenter.interaction.ECShopInteractionPresenterV2;
import com.bytedance.android.shopping.store.viewmodel.ECStoreViewModel;
import com.bytedance.memoryx.StringBuilderCache;
import com.ss.android.ugc.bytex.async.stack.TransmitHandler;
import com.ss.android.ugc.bytex.kt_intermediate.lib.CheckNpeV2;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.Iterator;
import kotlin.collections.CollectionsKt___CollectionsKt;
import kotlin.jvm.internal.ALambdaS1716S0200000_13;
import kotlin.jvm.internal.Intrinsics;

/* JADX INFO: loaded from: /Users/yiming/Documents/Codex/2026-11-17/wo-x/work/douyin-inspect/dex/classes6.dex */
public final class TopSheetLayout extends LinearLayout {
    public boolean A;
    public ArrayList a;
    public View b;
    public final Scroller d;
    public WeakReference e;
    public C0MS4 f;
    public boolean g;
    public boolean h;
    public int i;
    public int j;
    public int k;
    public final VelocityTracker l;
    public int m;
    public boolean n;
    public boolean o;
    public final ArrayList p;
    public boolean q;
    public C0MS3 r;
    public RecyclerView s;
    public int t;
    public View u;
    public final ASListenerS209S0100000_13 v;
    public final int w;
    public boolean x;
    public final int[] y;
    public int z;

    public final View getContentView() {
        return this.b;
    }

    public final boolean getEnableInternalScroll() {
        return this.o;
    }

    public final boolean getEnableSetNestedScrollView() {
        return this.q;
    }

    public final boolean getEnableSheetScroll() {
        return this.n;
    }

    public final C0MS4 getOnTopSheetOffsetChangeListener() {
        return this.f;
    }

    public final C0MS3 getScrollListener() {
        return this.r;
    }

    public final boolean getSlideByHand() {
        return this.x;
    }

    public final View getTargetChild() {
        return this.u;
    }

    public final ArrayList<View> getTopSheetViews() {
        return this.a;
    }

    public final int getHeaderScrollRange() {
        return getTopSheetViewHeight();
    }

    public final boolean LJII() {
        if (getScrollY() == getTopSheetViewHeight()) {
            return true;
        }
        return false;
    }

    private final int getTopSheetViewHeight() {
        Iterator it = this.a.iterator();
        int iLJFF = 0;
        while (it.hasNext()) {
            iLJFF += LJFF((View) it.next());
        }
        return iLJFF;
    }

    public final void LIZIZ() {
        this.d.abortAnimation();
        this.z = getScrollY();
        this.x = false;
        scrollTo(0, getTopSheetViewHeight());
        LIZJ();
    }

    private final View getCurrentSheetView() {
        int size = this.a.size();
        int i = 0;
        int i2 = 0;
        while (i < size) {
            View childAt = getChildAt(i);
            View childAt2 = getChildAt(i);
            Intrinsics.checkNotNullExpressionValue(childAt2, "");
            int iLJFF = LJFF(childAt2) + i2;
            int scrollY = getScrollY();
            if (i2 <= scrollY && scrollY <= iLJFF) {
                return childAt;
            }
            i++;
            i2 = iLJFF;
        }
        return null;
    }

    public final void LJIIIZ() {
        this.d.abortAnimation();
        this.z = getScrollY();
        this.d.startScroll(0, getScrollY(), 0, -getScrollY(), this.w);
        invalidate();
        LIZJ();
    }

    @Override // android.view.View
    public final void computeScroll() {
        View view;
        super.computeScroll();
        if (this.d.computeScrollOffset()) {
            this.A = true;
            int currY = this.d.getCurrY() - this.z;
            this.z = this.d.getCurrY();
            WeakReference weakReference = this.e;
            if (weakReference != null) {
                view = (View) weakReference.get();
            } else {
                view = null;
            }
            int[] iArr = this.y;
            iArr[0] = 0;
            iArr[1] = 0;
            LJIIJ(currY, view, iArr);
            if (view != null) {
                int i = currY - this.y[1];
                if (view.canScrollVertically(i)) {
                    try {
                        view.scrollBy(0, i);
                    } catch (Exception e) {
                        C35640Msx.LIZ.getClass();
                        C35640Msx.LIZ("shop.topsheetlayout").LIZIZ(e.getMessage(), e);
                    }
                }
            }
            invalidate();
        }
        if (this.A && this.d.isFinished()) {
            this.A = false;
            this.e = null;
            LJIIIIZZ();
            if (this.s != null && this.t != 0) {
                LIZLLL(0);
            }
        }
    }

    public final void LIZJ() {
        C0MS4 c0ms4 = this.f;
        if (c0ms4 != null) {
            ((C21770MRw) c0ms4).LIZ.LLLZZIL(getScrollY(), getTopSheetViewHeight());
        }
        if (getTopSheetViewHeight() > 0.0f && getScrollY() <= getTopSheetViewHeight()) {
            C0MS4 c0ms5 = this.f;
            if (c0ms5 != null) {
                float scrollY = getScrollY() / getTopSheetViewHeight();
                boolean z = this.x;
                C21770MRw c21770MRw = (C21770MRw) c0ms5;
                if (c21770MRw.LIZ.LLZLI()) {
                    ECShopInteractionPresenterV2 eCShopInteractionPresenterV2 = c21770MRw.LIZ;
                    TopSheetLayout topSheetLayout = eCShopInteractionPresenterV2.topSheetLayout;
                    TopSheetLayout topSheetLayout2 = null;
                    if (topSheetLayout == null) {
                        Intrinsics.throwUninitializedPropertyAccessException("");
                        topSheetLayout = null;
                    }
                    int scrollY2 = topSheetLayout.getScrollY();
                    TopSheetLayout topSheetLayout3 = c21770MRw.LIZ.topSheetLayout;
                    if (topSheetLayout3 == null) {
                        Intrinsics.throwUninitializedPropertyAccessException("");
                    } else {
                        topSheetLayout2 = topSheetLayout3;
                    }
                    eCShopInteractionPresenterV2.LLZLLLL(scrollY2, topSheetLayout2.getHeaderScrollRange(), z);
                }
                ECStoreViewModel eCStoreViewModelLLLLL = c21770MRw.LIZ.LLLLL();
                eCStoreViewModelLLLLL.y2 = z;
                eCStoreViewModelLLLLL.P1.setValue(Float.valueOf(scrollY));
                if (z) {
                    c21770MRw.LIZ.LLLLL().lE();
                }
            }
            View currentSheetView = getCurrentSheetView();
            if (currentSheetView == null) {
                return;
            }
            getScrollY();
            currentSheetView.getY();
            if (LJFF(currentSheetView) != 0) {
                LJFF(currentSheetView);
            }
            Integer numLJI = LJI(currentSheetView);
            if (numLJI != null) {
                numLJI.intValue();
                if (this.f != null) {
                    CheckNpeV2.throwNpe1(currentSheetView, 0);
                }
            }
        }
    }

    public final void LJIIIIZZ() {
        View currentSheetView;
        int i;
        Integer numLJI;
        int iIntValue;
        if (!this.d.isFinished() || (currentSheetView = getCurrentSheetView()) == null) {
            return;
        }
        Iterator itLLZ = GlobalProxyLancet.LLZ(this.a);
        Intrinsics.checkNotNullExpressionValue(itLLZ, "");
        int iLJFF = 0;
        while (itLLZ.hasNext()) {
            Object next = itLLZ.next();
            Intrinsics.checkNotNullExpressionValue(next, "");
            View view = (View) next;
            if (view == currentSheetView) {
                break;
            } else {
                iLJFF += LJFF(view);
            }
        }
        int iLJFF2 = LJFF(currentSheetView);
        while (CollectionsKt___CollectionsKt.contains(this.p, LJI(currentSheetView)) && (numLJI = LJI(currentSheetView)) != null && (iIntValue = numLJI.intValue() + 1) < getChildCount() && (currentSheetView = getChildAt(iIntValue)) != null) {
            iLJFF2 += LJFF(currentSheetView);
        }
        int scrollY = getScrollY() - iLJFF;
        if (1 <= scrollY && scrollY < iLJFF2 / 2) {
            i = -scrollY;
        } else if (iLJFF2 / 2 > scrollY || scrollY >= iLJFF2) {
            return;
        } else {
            i = iLJFF2 - scrollY;
        }
        if (i != 0) {
            this.z = getScrollY();
            this.d.startScroll(0, getScrollY(), 0, i);
            invalidate();
        }
    }

    public final void setContentView(View view) {
        this.b = view;
    }

    public final void setEnableInternalScroll(boolean z) {
        this.o = z;
    }

    public final void setEnableSetNestedScrollView(boolean z) {
        this.q = z;
    }

    public final void setEnableSheetScroll(boolean z) {
        this.n = z;
    }

    public final void setOnTopSheetOffsetChangeListener(C0MS4 c0ms4) {
        this.f = c0ms4;
    }

    public final void setScrollListener(C0MS3 c0ms3) {
        this.r = c0ms3;
    }

    public final void setSlideByHand(boolean z) {
        this.x = z;
    }

    public final void setTargetChild(View view) {
        this.u = view;
    }

    public final void setTopSheetViews(ArrayList<View> arrayList) {
        CheckNpeV2.throwNpe1(arrayList, 0);
        this.a = arrayList;
    }

    @Override // android.view.View
    public final boolean canScrollVertically(int i) {
        if ((i >= 0 || getScrollY() != 0) && this.n) {
            return true;
        }
        return false;
    }

    @Override // android.view.ViewGroup, android.view.ViewParent
    public final void onStopNestedScroll(View view) {
        CheckNpeV2.throwNpe1(view, 0);
        super.onStopNestedScroll(view);
        this.h = false;
        LJIIIIZZ();
    }

    public static int LJFF(View view) {
        int i;
        ViewGroup.MarginLayoutParams marginLayoutParams;
        int height = view.getHeight();
        ViewGroup.LayoutParams layoutParams = view.getLayoutParams();
        if ((layoutParams instanceof ViewGroup.MarginLayoutParams) && (marginLayoutParams = (ViewGroup.MarginLayoutParams) layoutParams) != null) {
            i = marginLayoutParams.topMargin + marginLayoutParams.bottomMargin;
        } else {
            i = 0;
        }
        return height + i;
    }

    public final void LIZLLL(int i) {
        this.t = i;
        C0MS3 c0ms3 = this.r;
        if (c0ms3 != null) {
            ((C21780MRx) c0ms3).LIZ.LLLLL().cb.setValue(Integer.valueOf(i));
        }
    }

    public final Integer LJI(View view) {
        int childCount = getChildCount();
        for (int i = 0; i < childCount; i++) {
            if (Intrinsics.areEqual(getChildAt(i), view)) {
                return Integer.valueOf(i);
            }
        }
        return null;
    }

    public final void LIZ(boolean z) {
        this.d.abortAnimation();
        this.z = getScrollY();
        this.d.startScroll(0, getScrollY(), 0, getTopSheetViewHeight() - getScrollY(), this.w);
        invalidate();
        this.x = z;
        LIZJ();
    }

    @Override // android.view.ViewGroup
    public final boolean onInterceptTouchEvent(MotionEvent motionEvent) {
        View view;
        boolean z = false;
        CheckNpeV2.throwNpe1(motionEvent, 0);
        if (motionEvent.getAction() == 0) {
            this.u = null;
            this.d.abortAnimation();
            this.e = null;
            if (this.t == 2) {
                LIZLLL(1);
            }
        }
        if (!this.h) {
            int action = motionEvent.getAction();
            if ((action == 2 && this.g) || super.onInterceptTouchEvent(motionEvent)) {
                z = true;
            } else if (getScrollY() != 0 || canScrollVertically(1)) {
                if (action != 0) {
                    if (action == 2) {
                        this.l.addMovement(motionEvent);
                        int y = (int) motionEvent.getY();
                        int i = this.j - y;
                        if (LJII() && (view = this.u) != null && view.canScrollVertically(i)) {
                            this.g = false;
                        } else if (Math.abs(i) > this.i) {
                            this.g = true;
                        }
                        if (this.t != 1 && this.g && canScrollVertically(i)) {
                            LIZLLL(1);
                        }
                        this.k = y;
                    }
                } else {
                    this.j = (int) motionEvent.getY();
                    this.k = (int) motionEvent.getY();
                    this.g = false;
                    this.l.clear();
                    this.l.addMovement(motionEvent);
                }
                z = this.g;
            }
        }
        Boolean boolValueOf = Boolean.valueOf(z);
        Intrinsics.checkNotNull(boolValueOf, "");
        boolean zBooleanValue = boolValueOf.booleanValue();
        0BGG.LIZ(zBooleanValue, motionEvent, this);
        return zBooleanValue;
    }

    @Override // android.view.View
    public final boolean onTouchEvent(MotionEvent motionEvent) {
        boolean z = false;
        CheckNpeV2.throwNpe1(motionEvent, 0);
        C35640Msx.LIZ.getClass();
        C35630Msw c35630MswLIZ = C35640Msx.LIZ("TopSheetLayout");
        StringBuilder sb = StringBuilderCache.get();
        sb.append("onTouchEvent lastMoveEventY = ");
        sb.append(this.k);
        sb.append(",ev.y = ");
        sb.append(motionEvent.getY());
        c35630MswLIZ.LIZ(StringBuilderCache.release(sb));
        if (this.n) {
            int action = motionEvent.getAction();
            this.l.addMovement(motionEvent);
            if (action != 1) {
                if (action != 2) {
                    if (action == 1) {
                    }
                } else {
                    int y = (int) (this.k - motionEvent.getY());
                    int[] iArr = this.y;
                    iArr[0] = 0;
                    iArr[1] = 0;
                    LJIIJ(y, this.u, iArr);
                    View view = this.u;
                    if (view != null) {
                        view.scrollBy(0, y - this.y[1]);
                    }
                    this.k = (int) motionEvent.getY();
                    if (this.t != 1 && Math.abs(y) > this.i && canScrollVertically(y)) {
                        LIZLLL(1);
                    }
                }
            } else {
                this.l.computeCurrentVelocity(1000, this.m);
                LJ(this.u, -this.l.getYVelocity());
            }
            if (this.d.isFinished()) {
                LJIIIIZZ();
            }
        }
        this.x = true;
        if (super.onTouchEvent(motionEvent) || this.n) {
            z = true;
        }
        Boolean boolValueOf = Boolean.valueOf(z);
        Intrinsics.checkNotNull(boolValueOf, "");
        boolean zBooleanValue = boolValueOf.booleanValue();
        0BGG.LIZIZ(zBooleanValue, motionEvent, this);
        return zBooleanValue;
    }

    public final void LJ(View view, float f) {
        if (view != null) {
            this.e = new WeakReference(view);
        }
        int i = (int) f;
        if (canScrollVertically(i)) {
            this.d.abortAnimation();
            this.d.fling(0, getScrollY(), 0, i, Integer.MIN_VALUE, Integer.MAX_VALUE, Integer.MIN_VALUE, Integer.MAX_VALUE);
            this.z = getScrollY();
            invalidate();
            if (this.s != null && this.t != 2) {
                LIZLLL(2);
            }
        }
    }

    /* JADX WARN: 'super' call moved to the top of the method (can break code semantics) */
    public TopSheetLayout(Context context, AttributeSet attributeSet) {
        long jLIZ;
        super(context, attributeSet, 0);
        CheckNpeV2.throwNpe1(context, 0);
        CheckNpeV2.throwNpe1(context, 0);
        this.a = new ArrayList();
        this.d = new Scroller(context, new AccelerateDecelerateInterpolator());
        this.l = VelocityTracker.obtain();
        this.n = true;
        this.o = true;
        this.p = new ArrayList();
        this.v = new ASListenerS209S0100000_13(this, 14);
        ShopCollapseAnimConfig shopCollapseAnimConfigLJ = C0NHW.LJ();
        if (shopCollapseAnimConfigLJ != null) {
            jLIZ = shopCollapseAnimConfigLJ.LIZ();
        } else {
            jLIZ = 500;
        }
        this.w = (int) jLIZ;
        TransmitHandler transmitHandler = C23060MWv.LIZ;
        C23060MWv.LIZJ(false, new ALambdaS1716S0200000_13(context, this, 122));
        this.y = new int[2];
    }

    @Override // android.widget.LinearLayout, android.view.View
    public void onMeasure(int i, int i2) {
        if (getChildCount() >= 2) {
            this.a.clear();
            int childCount = getChildCount();
            for (int i3 = 0; i3 < childCount; i3++) {
                View childAt = getChildAt(i3);
                if (i3 < getChildCount() - 1) {
                    GlobalProxyLancet.LLLZLZ(childAt, this.a);
                } else {
                    this.b = childAt;
                }
                measureChild(childAt, i, i2);
            }
            setMeasuredDimension(View.MeasureSpec.getSize(i), View.MeasureSpec.getSize(i2));
            return;
        }
        throw new IllegalArgumentException("child count must >= 2");
    }

    @Override // android.view.ViewGroup, android.view.ViewParent
    public final boolean onStartNestedScroll(View view, View view2, int i) {
        CheckNpeV2.throwNpe2(view, view2, 0, 0);
        if (!this.n || i != 2) {
            return false;
        }
        this.h = true;
        return true;
    }

    @Override // android.view.ViewGroup, android.view.ViewParent
    public final boolean onNestedPreFling(View view, float f, float f2) {
        boolean z;
        CheckNpeV2.throwNpe1(view, 0);
        if (!this.n) {
            return false;
        }
        int iCompare = Float.compare(f2, 0.0f);
        if (iCompare != 0 && view.canScrollVertically(iCompare)) {
            z = true;
        } else {
            z = false;
        }
        if (getTopSheetViewHeight() <= 0 || (LJII() && z)) {
            return false;
        }
        LJ(view, f2);
        return true;
    }

    public final void LJIIJ(int i, View view, int[] iArr) {
        int topSheetViewHeight;
        if (getTopSheetViewHeight() > 0 && i != 0 && this.o) {
            if (getScrollY() >= getTopSheetViewHeight()) {
                if (LJII()) {
                    if (view != null && view.canScrollVertically(i)) {
                        return;
                    }
                } else {
                    return;
                }
            }
            if (getScrollY() + i > getTopSheetViewHeight()) {
                topSheetViewHeight = getTopSheetViewHeight() - getScrollY();
            } else {
                topSheetViewHeight = i;
            }
            if (i + getScrollY() < 0) {
                topSheetViewHeight = -getScrollY();
            }
            scrollBy(0, topSheetViewHeight);
            if (iArr != null) {
                iArr[1] = topSheetViewHeight;
            }
            if (topSheetViewHeight == 0) {
                return;
            }
            this.x = true;
            LIZJ();
        }
    }

    @Override // android.view.ViewGroup, android.view.ViewParent
    public final void onNestedPreScroll(View view, int i, int i2, int[] iArr) {
        CheckNpeV2.throwNpe2(view, iArr, 0, 0);
        if ((view instanceof ECHybridRecyclerView) && this.q) {
            if (!Intrinsics.areEqual(view, this.s)) {
                ((RecyclerView) view).addOnScrollListener(this.v);
                this.s = (RecyclerView) view;
            }
        } else {
            RecyclerView recyclerView = this.s;
            if (recyclerView != null) {
                recyclerView.removeOnScrollListener(this.v);
            }
            this.s = null;
        }
        LJIIJ(i2, view, iArr);
    }
}
