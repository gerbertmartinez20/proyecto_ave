package com.proyecto_ave2;

import android.app.Application;


import com.facebook.react.ReactApplication;
import com.huawei.hms.rn.push.HmsPushPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import im.shimo.react.prompt.RNPromptPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.brentvatne.react.ReactVideoPackage;
import com.wenkesj.voice.VoicePackage;
import com.rnfingerprint.FingerprintAuthPackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  
  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new HmsPushPackage(),
            new LinearGradientPackage(),
            new RNPromptPackage(),
            new OrientationPackage(),
            new KCKeepAwakePackage(),
            new ReactVideoPackage(),
            new VoicePackage(),
            new FingerprintAuthPackage(),
            new ImagePickerPackage(),
            new VectorIconsPackage(),
            new RNFirebasePackage(),
            new RNFirebaseMessagingPackage(),
            new RNFirebaseNotificationsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {

    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
