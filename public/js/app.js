// store
var _store = {
  // 返回一个唯一的article id;
  // 这个id也是articles的数组index
  aid: function() {
    var articles = this.fetch();
    if (articles) {
      return articles[articles.length].aid + 1;
    } else {
      return 0;
    }
  },
  // 从原始数据从生成新的文章
  set: function(value) {
    if (key) {
      var aid = this.aid();
      localStorage.setItem('article' + aid,JSON.stringify(value));
      this.push(aid);
      return key;
    } else {
      return false;
    }
  },
  // 保存
  save: function(key,value) {
    if (key) {
      localStorage.setItem(key,value);
      return key;
    } else {
      return false;
    }
  },
  // 将单篇文章推送到全部文章的数组里
  push: function(id) {
    var articles = this.fetch();
    var article = this.get(id);
    articles.push(article);
    this.save('articles',articles)
  },
  // 根据ID拿到单篇文章
  get: function(key) {
    if (key) {
      return localStorage.getItem('article' + key) === null ? null : JSON.parse(localStorage.getItem('article' + key));
    }
  },
  // 拿到所有文章
  fetch: function() {
    return JSON.parse(localStorage.getItem('articles'));
  },
  // 删除一篇文章
  remove: function(id) {
    // 首先删除单独保存的，然后删除所有文章列表中的
    localStorage.removeItem('article' + id);
    var articles = this.fetch();
    if (articles) {
      delete articles[id];
    } else {
      return false;
    }
  }
};

//app.js
var clipperApp = {
  ctrls: {
    articles: function($scope) {
      $scope.articles = _store.fetch() === null ? [] : _store.fetch();
    },
    article: function($scope,$routeParams) {
      var articleID = $routeParams.rid;
      $scope.article = _store.get(articleID);
      $scope.remove = function(id) {
        _store.remove(id);
      }
    },
    clipper: function($scope) {
    }
  }
};

var clipper = angular.module('clipper', [])
.directive('dragAndDrop', function() {
  return {
    restrict: 'A',
    link: function($scope, elem, attr) {
      var clearTimer = null;

      $scope.text = "拖放到这里";

      elem.bind('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();

        clearTimeout(clearTimer);
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'copy';
        }
      });

      elem.bind('dragenter', function(e) {
        e.stopPropagation();
        e.preventDefault();

        clearTimeout(clearTimer);
        $scope.$apply(function() {
          $scope.text = '松开鼠标';
        });
      });

      elem.bind('dragleave', function(e) {
        e.stopPropagation();
        e.preventDefault();

        clearTimeout(clearTimer);
        $scope.$apply(function() {
          $scope.text = '拖放到这里';
        });
      });

      elem.bind('drop', function(e) {
        e.stopPropagation();
        e.preventDefault();

        var html = null;

        try {
          html = e.originalEvent.dataTransfer.getData('text/html');
        } catch (err) {}

        var tip = html ? '内容已保存' : '错误的内容';

        $scope.$apply(function () {
          $scope.text = tip;
        });

        clearTimeout(clearTimer);
        clearTimer = setTimeout(function () {
          $scope.$apply(function () {
            $scope.text = '拖放到这里';
          });
        }, 1000);

        if (html) {
          _store.set(html);
        }
      });
    }
  };
})
.config(function($routeProvider) {
  $routeProvider.
    when('/articles', {
    controller: clipperApp.articles,
    templateUrl: 'views/articles.html'
  }).
    when('/clipper', {
    controller: clipperApp.clipper,
    templateUrl: 'views/clipper.html'
  }).
    when('/article', {
    controller: clipperApp.article,
    templateUrl: 'views/article.html'
  }).
    otherwise({
    redirectTo: '/clipper'
  });
});

// vim: sts=2 ts=2 sw=2 :
