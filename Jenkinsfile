@Library(['Hurley-Jenkins-Common@master','Hurley-Jenkins-Pipelines@master']) _

import com.warnermedia.hurley.executor.HurleyPrPipelineExecutor

String projectName = 'Hurley-Chameleon'

node {
  HurleyPrPipelineExecutor exe = new HurleyPrPipelineExecutor(this)
  exe.execute(projectName, env.BRANCH_NAME, env.CHANGE_ID)
}
