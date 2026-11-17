package com.bytedance.android.shopping.store.home.slice;

import X.0iZM;
import X.0jFc;
import X.0jpB;
import X.18SD;
import X.1Etf;
import X.AbstractC16950M9i;
import X.C0MJU;
import X.C0MK0;
import X.C0MK7;
import X.C0MK8;
import X.C0MKZ;
import X.C0MLL;
import X.C0MM0;
import X.C0MML;
import X.C0MN9;
import X.C0MNB;
import X.C0MNS;
import X.C0MNT;
import X.C0MNX;
import X.C0MV2;
import X.C19920MKt;
import X.C20000MLb;
import X.C20050MLg;
import X.C20170MLs;
import X.C20240MLz;
import X.C20400MMp;
import X.C20420MMr;
import X.C22530MUu;
import X.C25170Mc4;
import X.C35630Msw;
import X.C35640Msx;
import X.EnumC20040MLf;
import X.EnumC20080MLj;
import X.EnumC20410MMq;
import X.EnumC23410MYe;
import Y.AaS4276S0100000_13;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Lifecycle;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.OnLifecycleEvent;
import com.bytedance.android.ec.adapter.api.IAdapterService;
import com.bytedance.android.ec.sdk.ECSdk;
import com.bytedance.android.ec.store.view.ECScrollTagListView;
import com.bytedance.android.ec.store.view.ECTagListView;
import com.bytedance.android.ecom.arch.slice.render.SlcTemplateViewInfo;
import com.bytedance.android.ecom.arch.slice.render.context.SlcRenderContext;
import com.bytedance.android.ecom.arch.slice.render.context.SlcTemplateContext;
import com.bytedance.android.shopping.store.home.presenter.ECShopBasePresenter;
import com.bytedance.android.shopping.store.home.view.ECShopMarqueeTextView;
import com.bytedance.android.shopping.store.viewmodel.ECStoreViewModel;
import com.bytedance.memoryx.StringBuilderCache;
import com.ss.android.ugc.aweme.ByteXGenericLifecycleObserver;
import com.ss.android.ugc.aweme.compat.nullable.Observer;
import com.ss.android.ugc.aweme.kiwi.model.QModel;
import com.ss.android.ugc.bytex.kt_intermediate.lib.CheckNpeV2;
import io.reactivex.disposables.Disposable;
import io.reactivex.functions.Consumer;
import java.lang.ref.WeakReference;
import java.util.LinkedHashMap;
import java.util.Map;
import kotlin.Lazy;
import kotlin.LazyKt__LazyJVMKt;
import kotlin.TuplesKt;
import kotlin.collections.MapsKt__MapsJVMKt;
import kotlin.collections.MapsKt__MapsKt;
import kotlin.jvm.internal.ALambdaS275S1000000_13;
import kotlin.jvm.internal.ALambdaS4430S0100000_13;
import kotlin.jvm.internal.ALambdaS4487S0100000_13;
import kotlin.jvm.internal.Intrinsics;
import kotlin.jvm.internal.Reflection;
import kotlin.ranges.RangesKt;

/* JADX INFO: loaded from: /Users/yiming/Documents/Codex/2026-11-17/wo-x/work/douyin-inspect/dex/classes6.dex */
public final class ECShopSliceProfilePresenter extends ECShopBasePresenter implements ByteXGenericLifecycleObserver {
    public static final C0MNS Companion = new Object() { // from class: X.0MNS
    };
    public boolean hasEnterOtherPage;
    public ECScrollTagListView longTagListView;
    public View shopLogoView;
    public ECShopMarqueeTextView shopNameView;
    public ECTagListView shortTagListView;
    public final Lazy slcActionHandler$delegate;
    public Map<String, ? extends Object> sliceDataMap;
    public Map<String, Object> sliceItemActions;
    public Map<String, Object> sliceItemExtra;
    public Map<String, Object> sliceItemStates;
    public SlcTemplateViewInfo viewInfo;

    public final void onStateChanged(LifecycleOwner lifecycleOwner, Lifecycle.Event event) {
        if (event == Lifecycle.Event.ON_RESUME) {
            onResume();
        } else if (event == Lifecycle.Event.ON_PAUSE) {
            onPause();
        }
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_PAUSE)
    public final void onPause() {
        this.hasEnterOtherPage = true;
        if (LLLLL().yE()) {
            ECScrollTagListView eCScrollTagListView = this.longTagListView;
            if (eCScrollTagListView != null) {
                eCScrollTagListView.setHasShopNameScrollEnd(false);
            }
            ECScrollTagListView eCScrollTagListView2 = this.longTagListView;
            if (eCScrollTagListView2 != null) {
                eCScrollTagListView2.LIZJ();
            }
        }
    }

    public final void LLZLI() {
        float fFloatValue;
        float fCoerceIn;
        if (!LLLLL().yE()) {
            getView().setAlpha(1.0f);
            return;
        }
        C20420MMr c20420MMr = (C20420MMr) LLLLL().T1.getValue();
        if (c20420MMr != null && c20420MMr.LIZIZ > 0) {
            fCoerceIn = c20420MMr.LIZIZ();
        } else {
            Float f = (Float) LLLLL().P1.getValue();
            if (f != null) {
                fFloatValue = f.floatValue();
            } else {
                fFloatValue = 0.0f;
            }
            fCoerceIn = RangesKt.coerceIn(fFloatValue, 0.0f, 1.0f);
        }
        float f2 = 1.0f - fCoerceIn;
        if (getView().getAlpha() != f2) {
            getView().setAlpha(f2);
        }
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_RESUME)
    public final void onResume() {
        C0MNX eCLiveStateController;
        C0MN9 c0mn9LIZIZ;
        boolean z;
        if (this.hasEnterOtherPage) {
            final ECStoreViewModel eCStoreViewModelLLLLL = LLLLL();
            final ALambdaS4487S0100000_13 aLambdaS4487S0100000_13 = new ALambdaS4487S0100000_13(this, 182);
            eCStoreViewModelLLLLL.getClass();
            CheckNpeV2.throwNpe1(aLambdaS4487S0100000_13, 0);
            Disposable disposableSubscribe = 18SD.LIZ(eCStoreViewModelLLLLL.i.LIZ(eCStoreViewModelLLLLL.h, 0, "/sws/home/info/")).subscribe(new Consumer() { // from class: X.0MM6
                public final void accept(Object obj) {
                    C0ML6 c0ml6 = (C0ML6) obj;
                    Intrinsics.checkNotNull(c0ml6);
                    aLambdaS4487S0100000_13.invoke(AbstractC20160MLr.LIZ(c0ml6, eCStoreViewModelLLLLL.h));
                }
            }, new Consumer() { // from class: X.0MNP
                public final /* bridge */ /* synthetic */ void accept(Object obj) {
                }
            });
            Intrinsics.checkNotNullExpressionValue(disposableSubscribe, "");
            1Etf.LIZ(disposableSubscribe, eCStoreViewModelLLLLL);
            IAdapterService iAdapterService = (IAdapterService) ECSdk.INSTANCE.getService(IAdapterService.class);
            if (iAdapterService != null && (eCLiveStateController = iAdapterService.getECLiveStateController()) != null && (c0mn9LIZIZ = ((C25170Mc4) eCLiveStateController).LIZIZ(EnumC23410MYe.SHOP, true)) != null) {
                C0MML c0mmlLJFF = LLLLL().h.LJFF();
                if (c0mn9LIZIZ == C0MN9.MUTE) {
                    z = true;
                } else {
                    z = false;
                }
                c0mmlLJFF.f = z;
            }
        }
        this.hasEnterOtherPage = false;
        if (LLLLL().yE()) {
            LLLZZIL();
        }
    }

    public final void LLLZZIL() {
        C20170MLs c20170MLsLJIIJ;
        boolean z = true;
        if (LLLLL().yE()) {
            if (this.hasEnterOtherPage || 0jpB.LIZLLL(0.0f, (Float) LLLLL().P1.getValue()) > 0.0f) {
                z = false;
            }
            ECScrollTagListView eCScrollTagListView = this.longTagListView;
            if (eCScrollTagListView != null) {
                eCScrollTagListView.setHasShopNameScrollEnd(z);
            }
            ECScrollTagListView eCScrollTagListView2 = this.longTagListView;
            if (z) {
                if (eCScrollTagListView2 != null) {
                    eCScrollTagListView2.LIZIZ();
                    return;
                }
                return;
            } else {
                if (eCScrollTagListView2 == null) {
                    return;
                }
                eCScrollTagListView2.LIZJ();
                return;
            }
        }
        ECStoreViewModel eCStoreViewModelLLLLL = LLLLL();
        C0MLL c0mll = (C0MLL) eCStoreViewModelLLLLL.q.getValue();
        if (c0mll != null && (c20170MLsLJIIJ = c0mll.LJIIJ()) != null && c20170MLsLJIIJ.LJI() != null && !Intrinsics.areEqual(eCStoreViewModelLLLLL.wE(), Boolean.TRUE) && Intrinsics.areEqual(LLLLL().u.getValue(), Boolean.TRUE) && 0jpB.LIZLLL(0.0f, (Float) LLLLL().P1.getValue()) <= 0.0f && 0jpB.LIZLLL(1.0f, (Float) LLLLL().V1.getValue()) >= 1.0f) {
            ECScrollTagListView eCScrollTagListView3 = this.longTagListView;
            if (eCScrollTagListView3 != null) {
                eCScrollTagListView3.LIZIZ();
                return;
            }
            return;
        }
        ECScrollTagListView eCScrollTagListView4 = this.longTagListView;
        if (eCScrollTagListView4 == null) {
            return;
        }
        eCScrollTagListView4.LIZJ();
    }

    public final void LLLZZ() {
        String str;
        C0MNX eCLiveStateController;
        Map mapLJIILJJIL;
        if (this.sliceDataMap == null) {
            return;
        }
        Map<String, Object> map = this.sliceItemStates;
        if (LLLLL().h.LJFF().f) {
            str = "mute";
        } else {
            IAdapterService iAdapterService = (IAdapterService) ECSdk.INSTANCE.getService(IAdapterService.class);
            if (iAdapterService != null) {
                iAdapterService.muteLiveRoom();
            }
            str = "unmute";
        }
        map.put("shop_live_volume_state", str);
        IAdapterService iAdapterService2 = (IAdapterService) ECSdk.INSTANCE.getService(IAdapterService.class);
        Object obj = null;
        if (iAdapterService2 != null) {
            eCLiveStateController = iAdapterService2.getECLiveStateController();
        } else {
            eCLiveStateController = null;
        }
        if (LLLLL().GD() && LLLLL().h.LJFF().e && eCLiveStateController != null) {
            ((C25170Mc4) eCLiveStateController).LIZLLL(C0MNB.OPEN, EnumC23410MYe.SHOP, null);
        }
        LinkedHashMap linkedHashMap = new LinkedHashMap();
        linkedHashMap.putAll(this.sliceItemStates);
        linkedHashMap.putAll(((C22530MUu) LLLLL().cE()).LJ());
        LinkedHashMap linkedHashMap2 = new LinkedHashMap();
        Map<String, ? extends Object> mapEmptyMap = this.sliceDataMap;
        if (mapEmptyMap == null) {
            mapEmptyMap = MapsKt__MapsKt.emptyMap();
        }
        linkedHashMap2.putAll(mapEmptyMap);
        linkedHashMap2.put("slice_item_actions", this.sliceItemActions);
        linkedHashMap2.put("slice_item_states", linkedHashMap);
        linkedHashMap2.put("slice_item_extra", this.sliceItemExtra);
        Map mapMapOf = MapsKt__MapsJVMKt.mapOf(TuplesKt.to("data", linkedHashMap2));
        C35640Msx.LIZ.getClass();
        C35630Msw c35630MswLIZ = C35640Msx.LIZ("ECShopInfoTotalAreaSlicePresenter");
        StringBuilder sb = StringBuilderCache.get();
        sb.append("bindData, sliceItemStates: ");
        sb.append(this.sliceItemStates);
        c35630MswLIZ.LIZ(StringBuilderCache.release(sb));
        C35630Msw c35630MswLIZ2 = C35640Msx.LIZ("ECShopInfoTotalAreaSlicePresenter");
        StringBuilder sb2 = StringBuilderCache.get();
        sb2.append("bindData, dataCtx sliceItemStates: ");
        Object obj2 = mapMapOf.get("data");
        if (obj2 != null && (mapLJIILJJIL = 0iZM.LJIILJJIL(obj2)) != null) {
            obj = mapLJIILJJIL.get("slice_item_states");
        }
        sb2.append(obj);
        c35630MswLIZ2.LIZ(StringBuilderCache.release(sb2));
        SlcTemplateViewInfo slcTemplateViewInfo = this.viewInfo;
        if (slcTemplateViewInfo != null) {
            slcTemplateViewInfo.bindData(mapMapOf, EnumC20080MLj.SHOP_PROFILE.getId());
        }
    }

    public final void LLZILL() {
        View view;
        View viewFindViewBySliceKey;
        View contentView;
        ECTagListView eCTagListView;
        View viewFindViewBySliceKey2;
        View contentView2;
        ECScrollTagListView eCScrollTagListView;
        View viewFindViewBySliceKey3;
        Object contentView3;
        ECShopMarqueeTextView eCShopMarqueeTextView;
        View viewFindViewBySliceKey4;
        SlcTemplateContext slcTemplateContext;
        SlcRenderContext slcRenderContext;
        SlcTemplateContext slcTemplateContext2;
        SlcRenderContext slcRenderContext2;
        0jFc r1;
        SlcTemplateContext slcTemplateContext3;
        SlcRenderContext slcRenderContext3;
        0jFc r2;
        SlcTemplateContext slcTemplateContext4;
        SlcRenderContext slcRenderContext4;
        0jFc r3;
        SlcTemplateContext slcTemplateContext5;
        SlcRenderContext slcRenderContext5;
        ViewGroup viewGroup;
        SlcTemplateViewInfo slcTemplateViewInfo = this.viewInfo;
        if (slcTemplateViewInfo != null && (view = slcTemplateViewInfo.getView()) != null) {
            FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(-1, -2);
            View view2 = getView();
            View viewFindViewBySliceKey5 = null;
            if ((view2 instanceof ViewGroup) && (viewGroup = (ViewGroup) view2) != null) {
                viewGroup.addView(view, layoutParams);
            }
            SlcTemplateViewInfo slcTemplateViewInfo2 = this.viewInfo;
            if (slcTemplateViewInfo2 != null && (slcTemplateContext5 = slcTemplateViewInfo2.LIZIZ) != null && (slcRenderContext5 = slcTemplateContext5.LJIL) != null) {
                viewFindViewBySliceKey = slcRenderContext5.findViewBySliceKey(view, EnumC20410MMq.SHORT_TERM_INDICATORS.LIZ());
            } else {
                viewFindViewBySliceKey = null;
            }
            if ((viewFindViewBySliceKey instanceof 0jFc) && (r3 = (0jFc) viewFindViewBySliceKey) != null) {
                contentView = r3.getContentView();
            } else {
                contentView = null;
            }
            if (contentView instanceof ECTagListView) {
                eCTagListView = (ECTagListView) contentView;
            } else {
                eCTagListView = null;
            }
            this.shortTagListView = eCTagListView;
            SlcTemplateViewInfo slcTemplateViewInfo3 = this.viewInfo;
            if (slcTemplateViewInfo3 != null && (slcTemplateContext4 = slcTemplateViewInfo3.LIZIZ) != null && (slcRenderContext4 = slcTemplateContext4.LJIL) != null) {
                viewFindViewBySliceKey2 = slcRenderContext4.findViewBySliceKey(view, EnumC20410MMq.LONG_TERM_INDICATORS.LIZ());
            } else {
                viewFindViewBySliceKey2 = null;
            }
            if ((viewFindViewBySliceKey2 instanceof 0jFc) && (r2 = (0jFc) viewFindViewBySliceKey2) != null) {
                contentView2 = r2.getContentView();
            } else {
                contentView2 = null;
            }
            if (contentView2 instanceof ECScrollTagListView) {
                eCScrollTagListView = (ECScrollTagListView) contentView2;
            } else {
                eCScrollTagListView = null;
            }
            this.longTagListView = eCScrollTagListView;
            SlcTemplateViewInfo slcTemplateViewInfo4 = this.viewInfo;
            if (slcTemplateViewInfo4 != null && (slcTemplateContext3 = slcTemplateViewInfo4.LIZIZ) != null && (slcRenderContext3 = slcTemplateContext3.LJIL) != null) {
                viewFindViewBySliceKey3 = slcRenderContext3.findViewBySliceKey(view, EnumC20410MMq.SHOP_NAME.LIZ());
            } else {
                viewFindViewBySliceKey3 = null;
            }
            if ((viewFindViewBySliceKey3 instanceof 0jFc) && (r1 = (0jFc) viewFindViewBySliceKey3) != null) {
                contentView3 = r1.getContentView();
            } else {
                contentView3 = null;
            }
            if (contentView3 instanceof ECShopMarqueeTextView) {
                eCShopMarqueeTextView = (ECShopMarqueeTextView) contentView3;
            } else {
                eCShopMarqueeTextView = null;
            }
            this.shopNameView = eCShopMarqueeTextView;
            if (eCShopMarqueeTextView != null) {
                eCShopMarqueeTextView.setOnScrollEndAction(new ALambdaS4430S0100000_13(this, 470));
            }
            SlcTemplateViewInfo slcTemplateViewInfo5 = this.viewInfo;
            if (slcTemplateViewInfo5 != null && (slcTemplateContext2 = slcTemplateViewInfo5.LIZIZ) != null && (slcRenderContext2 = slcTemplateContext2.LJIL) != null) {
                viewFindViewBySliceKey4 = slcRenderContext2.findViewBySliceKey(view, EnumC20410MMq.SHOP_LOGO.LIZ());
            } else {
                viewFindViewBySliceKey4 = null;
            }
            this.shopLogoView = viewFindViewBySliceKey4;
            ECStoreViewModel eCStoreViewModelLLLLL = LLLLL();
            SlcTemplateViewInfo slcTemplateViewInfo6 = this.viewInfo;
            if (slcTemplateViewInfo6 != null && (slcTemplateContext = slcTemplateViewInfo6.LIZIZ) != null && (slcRenderContext = slcTemplateContext.LJIL) != null) {
                viewFindViewBySliceKey5 = slcRenderContext.findViewBySliceKey(view, EnumC20410MMq.FOLLOW_BUTTON.LIZ());
            }
            eCStoreViewModelLLLLL.Z = new WeakReference(viewFindViewBySliceKey5);
        }
        LLLLL().va.LIZ(Reflection.getOrCreateKotlinClass(C0MNT.class), new C20400MMp(this));
        if (LLLLL().yE()) {
            ECShopMarqueeTextView eCShopMarqueeTextView2 = this.shopNameView;
            if (eCShopMarqueeTextView2 != null) {
                eCShopMarqueeTextView2.LJJI();
            }
            LLLZZIL();
        }
    }

    public ECShopSliceProfilePresenter(Fragment fragment) {
        super(fragment);
        this.sliceItemStates = new LinkedHashMap();
        this.slcActionHandler$delegate = LazyKt__LazyJVMKt.lazy(new ALambdaS4430S0100000_13(this, 471));
    }

    public final void LLZIL(C20050MLg c20050MLg) {
        SlcTemplateContext slcTemplateContext;
        LLLLL().cE().LIZIZ(C0MM0.LIZ(c20050MLg));
        C20000MLb c20000MLbBE = LLLLL().bE();
        String strLIZIZ = c20050MLg.LIZIZ();
        c20000MLbBE.getClass();
        SlcTemplateViewInfo slcTemplateViewInfoLIZJ = c20000MLbBE.LIZJ("createHeaderCard", new ALambdaS275S1000000_13(strLIZIZ, 8));
        this.viewInfo = slcTemplateViewInfoLIZJ;
        if (slcTemplateViewInfoLIZJ != null) {
            slcTemplateViewInfoLIZJ.setActionHandler((C0MV2) this.slcActionHandler$delegate.getValue());
        }
        SlcTemplateViewInfo slcTemplateViewInfo = this.viewInfo;
        if (slcTemplateViewInfo != null && (slcTemplateContext = slcTemplateViewInfo.LIZIZ) != null) {
            slcTemplateContext.LJIILLIIL(EnumC20080MLj.SHOP_PROFILE.getId(), new AaS4276S0100000_13(this, 0));
        }
    }

    public final void onBind(QModel qModel) {
        Lifecycle lifecycle = LLLLLJLJLL().getLifecycle();
        if (lifecycle != null) {
            lifecycle.addObserver(this);
        }
        LLLLL().q.LIZ(LLLLLJLJLL(), new Observer() { // from class: com.bytedance.android.shopping.store.home.slice.ECShopSliceProfilePresenter.onBind.1
            public final void onChanged(Object obj) {
                C0MLL c0mll = (C0MLL) obj;
                CheckNpeV2.throwNpe1(c0mll, 0);
                C20050MLg c20050MLgLJI = c0mll.LJI();
                if (c20050MLgLJI != null) {
                    ECShopSliceProfilePresenter eCShopSliceProfilePresenter = ECShopSliceProfilePresenter.this;
                    C0MKZ c0mkzLIZ = C0MJU.LIZ(Long.valueOf(eCShopSliceProfilePresenter.LLLLL().h.M1));
                    if (c0mkzLIZ != null) {
                        c0mkzLIZ.LJJIJ();
                    }
                    eCShopSliceProfilePresenter.LLZIL(c20050MLgLJI);
                    eCShopSliceProfilePresenter.LLZL(c20050MLgLJI, c0mll.LJIIIZ());
                    eCShopSliceProfilePresenter.LLZLI();
                    eCShopSliceProfilePresenter.LLLZZ();
                    C0MJU.LIZ(Long.valueOf(eCShopSliceProfilePresenter.LLLLL().h.M1));
                    C0MKZ c0mkzLIZ2 = C0MJU.LIZ(Long.valueOf(eCShopSliceProfilePresenter.LLLLL().h.M1));
                    if (c0mkzLIZ2 != null) {
                        c0mkzLIZ2.LJJ();
                    }
                    eCShopSliceProfilePresenter.LLZILL();
                }
            }
        }, false);
        LLLLL().P.LIZ(LLLLLJLJLL(), new Observer() { // from class: com.bytedance.android.shopping.store.home.slice.ECShopSliceProfilePresenter.onBind.2
            public final void onChanged(Object obj) {
                C0MK0 c0mk0 = (C0MK0) obj;
                CheckNpeV2.throwNpe1(c0mk0, 0);
                C0MK7.LIZ(ECShopSliceProfilePresenter.this.sliceItemStates, c0mk0, "ECShopInfoTotalAreaSlicePresenter");
                ECShopSliceProfilePresenter.this.LLLZZ();
            }
        }, false);
        LLLLL().V1.LIZ(AbstractC16950M9i.LIZ(getQContext()), new Observer() { // from class: com.bytedance.android.shopping.store.home.slice.ECShopSliceProfilePresenter.onBind.3
            public final void onChanged(Object obj) {
                float fLLLLLLLLLL;
                ((Number) obj).floatValue();
                ECShopSliceProfilePresenter eCShopSliceProfilePresenter = ECShopSliceProfilePresenter.this;
                if (eCShopSliceProfilePresenter.LLLLLIL()) {
                    fLLLLLLLLLL = 1.0f;
                } else {
                    fLLLLLLLLLL = eCShopSliceProfilePresenter.LLLLLLLLLL();
                }
                ECShopSliceProfilePresenter.this.sliceItemStates.put("media_scroll_percent", Float.valueOf(fLLLLLLLLLL));
                ECShopSliceProfilePresenter.this.LLLZZ();
                ECShopSliceProfilePresenter.this.LLLZZIL();
            }
        }, false);
        LLLLL().P1.LIZ(AbstractC16950M9i.LIZ(getQContext()), new Observer() { // from class: com.bytedance.android.shopping.store.home.slice.ECShopSliceProfilePresenter.onBind.4
            public final void onChanged(Object obj) {
                ECShopSliceProfilePresenter.this.sliceItemStates.put("profile_scroll_percent", obj);
                ECShopSliceProfilePresenter.this.LLLZZ();
                ECShopSliceProfilePresenter.this.LLZLI();
                ECShopSliceProfilePresenter.this.LLLZZIL();
            }
        }, false);
        LLLLL().T1.LIZ(AbstractC16950M9i.LIZ(getQContext()), new Observer() { // from class: com.bytedance.android.shopping.store.home.slice.ECShopSliceProfilePresenter.onBind.5
            public final void onChanged(Object obj) {
                if (ECShopSliceProfilePresenter.this.LLLLL().yE()) {
                    ECShopSliceProfilePresenter.this.LLZLI();
                }
            }
        }, false);
        LLLLL().u.LIZ(AbstractC16950M9i.LIZ(getQContext()), new Observer() { // from class: com.bytedance.android.shopping.store.home.slice.ECShopSliceProfilePresenter.onBind.6
            public final void onChanged(Object obj) {
                ECScrollTagListView eCScrollTagListView = ECShopSliceProfilePresenter.this.longTagListView;
                if (eCScrollTagListView != null) {
                    eCScrollTagListView.setHasShopNameScrollEnd(true);
                }
                ECShopSliceProfilePresenter.this.LLLZZIL();
            }
        }, false);
    }

    public final void LLZL(C20050MLg c20050MLg, C19920MKt c19920MKt) {
        C20240MLz c20240MLz;
        Map<String, Object> mutableMap;
        this.sliceDataMap = c20050MLg.LIZ();
        Map mapLIZJ = c20050MLg.LIZJ();
        if (mapLIZJ != null && (c20240MLz = (C20240MLz) mapLIZJ.get(EnumC20040MLf.SHOP_PROFILE.getType())) != null) {
            Map mapLIZ = c20240MLz.LIZ();
            Map<String, Object> mutableMap2 = null;
            if (mapLIZ != null) {
                mutableMap = MapsKt__MapsKt.toMutableMap(mapLIZ);
            } else {
                mutableMap = null;
            }
            this.sliceItemActions = mutableMap;
            Map mapLIZJ2 = c20240MLz.LIZJ();
            if (mapLIZJ2 != null) {
                mutableMap2 = MapsKt__MapsKt.toMutableMap(mapLIZJ2);
            }
            this.sliceItemExtra = mutableMap2;
            Map<String, Object> map = this.sliceItemStates;
            Map<? extends String, ? extends Object> mapLIZLLL = c20240MLz.LIZLLL();
            if (mapLIZLLL == null) {
                mapLIZLLL = MapsKt__MapsKt.emptyMap();
            }
            map.putAll(mapLIZLLL);
        }
        C0MK8.LIZ(this.sliceItemStates, C0MK8.LIZIZ(c19920MKt));
        C35640Msx.LIZ.getClass();
        C35630Msw c35630MswLIZ = C35640Msx.LIZ("ECShopInfoTotalAreaSlicePresenter");
        StringBuilder sb = StringBuilderCache.get();
        sb.append("updateFollowStateFromAccountInfo, sliceItemStates: ");
        sb.append(this.sliceItemStates);
        c35630MswLIZ.LIZ(StringBuilderCache.release(sb));
    }
}
