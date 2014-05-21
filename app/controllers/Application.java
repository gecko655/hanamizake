package controllers;

import models.UserData;
import play.mvc.*;

public class Application extends Controller {

	public static void index() {
		no_session_auth();
        render();
    }
    
	/**
	 * セッションを用いたログイン認証を行うフィルタ.<br>
	 * 認証に失敗した場合はUsersController.login()にリダイレクトする。
	 */
	protected static void session_auth(){
		String username = session.get("username");
		UserData user_data = UserData.find("byUserName", username).first();
		if( user_data == null ){
			flash.put("error", "ログインしてください。");
			UsersController.login();
		}else{
			renderArgs.put("current_user", user_data);
		}
	}

	/**
	 * ログイン状態のユーザーに隠蔽したいアクション等に用いるフィルタ.<br>
	 * 既にログイン状態の場合はメニュー画面にリダイレクトを行う
	 */
	protected static void no_session_auth(){
		String username = session.get("username");
		UserData user_data = UserData.find("byUserName", username).first();
        if(user_data != null)
        	MenuController.index();
	}
}
